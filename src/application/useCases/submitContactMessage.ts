import type { ContactMessage, DraftContactMessage } from '../../domain/contactMessage';
import { validateContactMessage } from '../../domain/validateContactMessage';
import { InvalidContactMessageError } from '../errors/invalidContactMessageError';
import type { ContactMessageRepository } from '../ports/contactMessageRepository';

export type SubmitContactMessage = (draft: DraftContactMessage) => Promise<ContactMessage>;

export function createSubmitContactMessage(repository: ContactMessageRepository): SubmitContactMessage {
  return async (draft) => {
    const validation = validateContactMessage(draft);

    if (!validation.isValid) {
      throw new InvalidContactMessageError(validation.errors);
    }

    await repository.save(validation.contactMessage);
    return validation.contactMessage;
  };
}
