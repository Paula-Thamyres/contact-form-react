import { useCallback, useState } from 'react';
import { InvalidContactMessageError } from '../../application/errors/invalidContactMessageError';
import type { ContactUseCases } from '../../application/contactUseCases';
import {
  EMPTY_DRAFT_CONTACT_MESSAGE,
  type ContactFieldName,
  type ContactMessage,
  type ContactMessageErrors,
  type DraftContactMessage,
} from '../../domain/contactMessage';

const SUBMISSION_FAILURE_MESSAGE = 'Não foi possível enviar sua mensagem. Tente novamente em instantes.';

export function useContactForm(useCases: ContactUseCases) {
  const [draft, setDraft] = useState<DraftContactMessage>(EMPTY_DRAFT_CONTACT_MESSAGE);
  const [errors, setErrors] = useState<ContactMessageErrors>({});
  const [invalidSubmissionCount, setInvalidSubmissionCount] = useState(0);
  const [sentContactMessage, setSentContactMessage] = useState<ContactMessage | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [failureMessage, setFailureMessage] = useState<string | undefined>(undefined);

  const changeField = useCallback((fieldName: ContactFieldName, value: string) => {
    setDraft((currentDraft) => ({ ...currentDraft, [fieldName]: value }));
    setErrors((currentErrors) => {
      const remainingErrors = { ...currentErrors };
      delete remainingErrors[fieldName];
      return remainingErrors;
    });
    setFailureMessage(undefined);
  }, []);

  const submit = useCallback(async () => {
    setIsSubmitting(true);
    setFailureMessage(undefined);

    try {
      const contactMessage = await useCases.submit(draft);
      setErrors({});
      setSentContactMessage(contactMessage);
    } catch (error) {
      if (error instanceof InvalidContactMessageError) {
        setErrors(error.errors);
        setInvalidSubmissionCount((currentCount) => currentCount + 1);
      } else {
        setFailureMessage(SUBMISSION_FAILURE_MESSAGE);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [draft, useCases]);

  const startNewMessage = useCallback(() => {
    setDraft(EMPTY_DRAFT_CONTACT_MESSAGE);
    setErrors({});
    setSentContactMessage(undefined);
  }, []);

  return {
    draft,
    errors,
    invalidSubmissionCount,
    sentContactMessage,
    isSubmitting,
    failureMessage,
    changeField,
    submit,
    startNewMessage,
  };
}
