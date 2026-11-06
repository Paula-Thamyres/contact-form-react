import type { ContactMessage, ContactMessageErrors, DraftContactMessage } from './contactMessage';
import {
  MAXIMUM_EMAIL_LENGTH,
  MAXIMUM_FULL_NAME_LENGTH,
  MAXIMUM_MESSAGE_LENGTH,
  MINIMUM_FULL_NAME_LENGTH,
  MINIMUM_FULL_NAME_WORD_COUNT,
  MINIMUM_MESSAGE_LENGTH,
} from './contactMessageRules';
import { isContactSubjectValue } from './contactSubject';
import { extractPhoneNumberDigits, isValidBrazilianPhoneNumber } from './phoneNumber';

export type ContactMessageValidation =
  | { readonly isValid: true; readonly contactMessage: ContactMessage }
  | { readonly isValid: false; readonly errors: ContactMessageErrors };

const FULL_NAME_PATTERN = /^\p{L}[\p{L}'’ -]*$/u;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const ERROR_MESSAGES = {
  fullNameRequired: 'Informe seu nome completo.',
  fullNameIncomplete: 'Informe nome e sobrenome.',
  fullNameTooLong: `O nome deve ter no máximo ${MAXIMUM_FULL_NAME_LENGTH} caracteres.`,
  fullNameInvalidCharacters: 'Use apenas letras, espaços, hífen e apóstrofo.',
  emailRequired: 'Informe seu e-mail.',
  emailInvalid: 'Informe um e-mail válido, como nome@exemplo.com.',
  emailTooLong: `O e-mail deve ter no máximo ${MAXIMUM_EMAIL_LENGTH} caracteres.`,
  phoneNumberInvalid: 'Informe um telefone com DDD, como (19) 91234-5678.',
  subjectRequired: 'Escolha um assunto.',
  messageRequired: 'Escreva sua mensagem.',
  messageTooShort: `A mensagem deve ter pelo menos ${MINIMUM_MESSAGE_LENGTH} caracteres.`,
  messageTooLong: `A mensagem deve ter no máximo ${MAXIMUM_MESSAGE_LENGTH} caracteres.`,
} as const;

function normalizeFullName(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

function validateFullName(normalizedFullName: string): string | undefined {
  if (normalizedFullName === '') {
    return ERROR_MESSAGES.fullNameRequired;
  }
  if (normalizedFullName.length > MAXIMUM_FULL_NAME_LENGTH) {
    return ERROR_MESSAGES.fullNameTooLong;
  }
  if (!FULL_NAME_PATTERN.test(normalizedFullName)) {
    return ERROR_MESSAGES.fullNameInvalidCharacters;
  }
  const wordCount = normalizedFullName.split(' ').length;
  if (normalizedFullName.length < MINIMUM_FULL_NAME_LENGTH || wordCount < MINIMUM_FULL_NAME_WORD_COUNT) {
    return ERROR_MESSAGES.fullNameIncomplete;
  }
  return undefined;
}

function validateEmail(normalizedEmail: string): string | undefined {
  if (normalizedEmail === '') {
    return ERROR_MESSAGES.emailRequired;
  }
  if (normalizedEmail.length > MAXIMUM_EMAIL_LENGTH) {
    return ERROR_MESSAGES.emailTooLong;
  }
  if (!EMAIL_PATTERN.test(normalizedEmail)) {
    return ERROR_MESSAGES.emailInvalid;
  }
  return undefined;
}

function validatePhoneNumber(trimmedPhoneNumber: string, phoneNumberDigits: string): string | undefined {
  if (trimmedPhoneNumber === '') {
    return undefined;
  }
  return isValidBrazilianPhoneNumber(phoneNumberDigits) ? undefined : ERROR_MESSAGES.phoneNumberInvalid;
}

function validateSubject(subject: string): string | undefined {
  return isContactSubjectValue(subject) ? undefined : ERROR_MESSAGES.subjectRequired;
}

function validateMessage(normalizedMessage: string): string | undefined {
  if (normalizedMessage === '') {
    return ERROR_MESSAGES.messageRequired;
  }
  if (normalizedMessage.length < MINIMUM_MESSAGE_LENGTH) {
    return ERROR_MESSAGES.messageTooShort;
  }
  if (normalizedMessage.length > MAXIMUM_MESSAGE_LENGTH) {
    return ERROR_MESSAGES.messageTooLong;
  }
  return undefined;
}

function omitUndefinedErrors(errors: Record<string, string | undefined>): ContactMessageErrors {
  return Object.fromEntries(Object.entries(errors).filter(([, errorMessage]) => errorMessage !== undefined));
}

export function validateContactMessage(draft: DraftContactMessage): ContactMessageValidation {
  const fullName = normalizeFullName(draft.fullName);
  const email = draft.email.trim().toLowerCase();
  const phoneNumberDigits = extractPhoneNumberDigits(draft.phoneNumber);
  const message = draft.message.trim();
  const subject = draft.subject;

  const errors = omitUndefinedErrors({
    fullName: validateFullName(fullName),
    email: validateEmail(email),
    phoneNumber: validatePhoneNumber(draft.phoneNumber.trim(), phoneNumberDigits),
    subject: validateSubject(subject),
    message: validateMessage(message),
  });

  if (Object.keys(errors).length > 0 || !isContactSubjectValue(subject)) {
    return { isValid: false, errors };
  }

  return {
    isValid: true,
    contactMessage: {
      fullName,
      email,
      phoneNumber: phoneNumberDigits === '' ? undefined : phoneNumberDigits,
      subject,
      message,
    },
  };
}
