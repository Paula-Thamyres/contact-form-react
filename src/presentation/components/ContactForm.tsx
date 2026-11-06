import { useEffect, type FormEvent } from 'react';
import {
  CONTACT_FIELD_NAMES,
  type ContactFieldName,
  type ContactMessageErrors,
  type DraftContactMessage,
} from '../../domain/contactMessage';
import { MAXIMUM_EMAIL_LENGTH, MAXIMUM_FULL_NAME_LENGTH, MAXIMUM_MESSAGE_LENGTH } from '../../domain/contactMessageRules';
import { CONTACT_SUBJECTS } from '../../domain/contactSubject';
import { formatPhoneNumber } from '../formatters/formatPhoneNumber';
import { getControlClassName } from './controlStyles';
import { FormField, getFieldElementIdentifier } from './FormField';

type ContactFormProperties = {
  draft: DraftContactMessage;
  errors: ContactMessageErrors;
  invalidSubmissionCount: number;
  isSubmitting: boolean;
  failureMessage: string | undefined;
  onFieldChange: (fieldName: ContactFieldName, value: string) => void;
  onSubmit: () => Promise<void>;
};

export function ContactForm({
  draft,
  errors,
  invalidSubmissionCount,
  isSubmitting,
  failureMessage,
  onFieldChange,
  onSubmit,
}: ContactFormProperties) {
  useEffect(() => {
    if (invalidSubmissionCount === 0) {
      return;
    }

    const firstInvalidFieldName = CONTACT_FIELD_NAMES.find((fieldName) => errors[fieldName] !== undefined);

    if (firstInvalidFieldName) {
      document.getElementById(getFieldElementIdentifier(firstInvalidFieldName))?.focus();
    }
  }, [invalidSubmissionCount]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void onSubmit();
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-5">
      <FormField fieldName="fullName" label="Nome completo" errorMessage={errors.fullName}>
        {(controlProperties) => (
          <input
            {...controlProperties}
            type="text"
            autoComplete="name"
            maxLength={MAXIMUM_FULL_NAME_LENGTH}
            value={draft.fullName}
            onChange={(event) => onFieldChange('fullName', event.target.value)}
            className={getControlClassName(errors.fullName !== undefined)}
          />
        )}
      </FormField>

      <FormField fieldName="email" label="E-mail" errorMessage={errors.email}>
        {(controlProperties) => (
          <input
            {...controlProperties}
            type="email"
            autoComplete="email"
            maxLength={MAXIMUM_EMAIL_LENGTH}
            value={draft.email}
            onChange={(event) => onFieldChange('email', event.target.value)}
            className={getControlClassName(errors.email !== undefined)}
          />
        )}
      </FormField>

      <FormField fieldName="phoneNumber" label="Telefone" isOptional errorMessage={errors.phoneNumber}>
        {(controlProperties) => (
          <input
            {...controlProperties}
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder="(19) 91234-5678"
            value={draft.phoneNumber}
            onChange={(event) => onFieldChange('phoneNumber', formatPhoneNumber(event.target.value))}
            className={getControlClassName(errors.phoneNumber !== undefined)}
          />
        )}
      </FormField>

      <FormField fieldName="subject" label="Assunto" errorMessage={errors.subject}>
        {(controlProperties) => (
          <select
            {...controlProperties}
            value={draft.subject}
            onChange={(event) => onFieldChange('subject', event.target.value)}
            className={getControlClassName(errors.subject !== undefined)}
          >
            <option value="">Selecione</option>
            {CONTACT_SUBJECTS.map((subject) => (
              <option key={subject.value} value={subject.value}>
                {subject.label}
              </option>
            ))}
          </select>
        )}
      </FormField>

      <FormField
        fieldName="message"
        label="Mensagem"
        errorMessage={errors.message}
        hint={`${draft.message.length}/${MAXIMUM_MESSAGE_LENGTH}`}
      >
        {(controlProperties) => (
          <textarea
            {...controlProperties}
            rows={6}
            maxLength={MAXIMUM_MESSAGE_LENGTH}
            value={draft.message}
            onChange={(event) => onFieldChange('message', event.target.value)}
            className={`${getControlClassName(errors.message !== undefined)} resize-y`}
          />
        )}
      </FormField>

      {failureMessage && (
        <p role="alert" className="text-sm text-danger">
          {failureMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="accent-button w-full cursor-pointer rounded-full px-6 py-3 font-medium transition enabled:hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Enviando...' : 'Enviar mensagem'}
      </button>
    </form>
  );
}
