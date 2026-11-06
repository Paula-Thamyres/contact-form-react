import { describe, expect, it } from 'vitest';
import { createValidDraftContactMessage } from '../testing/createValidDraftContactMessage';
import { EMPTY_DRAFT_CONTACT_MESSAGE } from './contactMessage';
import { MAXIMUM_FULL_NAME_LENGTH, MAXIMUM_MESSAGE_LENGTH } from './contactMessageRules';
import { validateContactMessage } from './validateContactMessage';

function getErrors(overrides: Parameters<typeof createValidDraftContactMessage>[0]) {
  const validation = validateContactMessage(createValidDraftContactMessage(overrides));
  return validation.isValid ? {} : validation.errors;
}

describe('validateContactMessage', () => {
  it('accepts a valid draft and normalizes its values', () => {
    const validation = validateContactMessage(
      createValidDraftContactMessage({
        fullName: '  Maria   da  Silva ',
        email: ' Maria@Exemplo.COM ',
        message: '  Mensagem com espaços nas pontas.  ',
      }),
    );

    expect(validation).toEqual({
      isValid: true,
      contactMessage: {
        fullName: 'Maria da Silva',
        email: 'maria@exemplo.com',
        phoneNumber: '19912345678',
        subject: 'question',
        message: 'Mensagem com espaços nas pontas.',
      },
    });
  });

  it('reports every required field when the form is empty', () => {
    const validation = validateContactMessage(EMPTY_DRAFT_CONTACT_MESSAGE);

    expect(validation.isValid).toBe(false);
    expect(Object.keys(validation.isValid ? {} : validation.errors).sort()).toEqual(
      ['email', 'fullName', 'message', 'subject'].sort(),
    );
  });

  it('treats the phone number as optional', () => {
    const validation = validateContactMessage(createValidDraftContactMessage({ phoneNumber: '' }));

    expect(validation.isValid && validation.contactMessage.phoneNumber).toBeUndefined();
    expect(validation.isValid).toBe(true);
  });

  describe('full name', () => {
    it('requires a surname', () => {
      expect(getErrors({ fullName: 'Maria' }).fullName).toBe('Informe nome e sobrenome.');
    });

    it('rejects digits and symbols', () => {
      expect(getErrors({ fullName: 'Maria 2 Silva' }).fullName).toBe('Use apenas letras, espaços, hífen e apóstrofo.');
    });

    it('accepts accents, hyphens and apostrophes', () => {
      expect(getErrors({ fullName: "João d'Ávila Souza-Lima" }).fullName).toBeUndefined();
    });

    it('rejects names above the maximum length', () => {
      const tooLongName = `Maria ${'a'.repeat(MAXIMUM_FULL_NAME_LENGTH)}`;

      expect(getErrors({ fullName: tooLongName }).fullName).toContain('no máximo');
    });
  });

  describe('email', () => {
    it.each(['maria', 'maria@', '@exemplo.com', 'maria@exemplo', 'maria @exemplo.com', 'maria@exemplo.c'])(
      'rejects %s',
      (invalidEmail) => {
        expect(getErrors({ email: invalidEmail }).email).toBe('Informe um e-mail válido, como nome@exemplo.com.');
      },
    );
  });

  describe('phone number', () => {
    it.each(['(19) 91234-5678', '19912345678', '(19) 3456-7890'])('accepts %s', (validPhoneNumber) => {
      expect(getErrors({ phoneNumber: validPhoneNumber }).phoneNumber).toBeUndefined();
    });

    it.each(['123', '(00) 91234-5678', '(19) 81234-5678', '(19) 1234-5678', 'abc'])(
      'rejects %s',
      (invalidPhoneNumber) => {
        expect(getErrors({ phoneNumber: invalidPhoneNumber }).phoneNumber).toBeDefined();
      },
    );
  });

  describe('subject', () => {
    it('rejects values outside the available subjects', () => {
      expect(getErrors({ subject: 'unknown' }).subject).toBe('Escolha um assunto.');
    });
  });

  describe('message', () => {
    it('rejects messages that are only whitespace', () => {
      expect(getErrors({ message: '           ' }).message).toBe('Escreva sua mensagem.');
    });

    it('rejects messages that are too short', () => {
      expect(getErrors({ message: 'Oi' }).message).toContain('pelo menos');
    });

    it('rejects messages above the maximum length', () => {
      expect(getErrors({ message: 'a'.repeat(MAXIMUM_MESSAGE_LENGTH + 1) }).message).toContain('no máximo');
    });
  });
});
