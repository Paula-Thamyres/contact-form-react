import { describe, expect, it } from 'vitest';
import { EMPTY_DRAFT_CONTACT_MESSAGE } from '../../domain/contactMessage';
import { createValidDraftContactMessage } from '../../testing/createValidDraftContactMessage';
import { InMemoryContactMessageRepository } from '../../testing/inMemoryContactMessageRepository';
import { InvalidContactMessageError } from '../errors/invalidContactMessageError';
import { createSubmitContactMessage } from './submitContactMessage';

describe('submitContactMessage', () => {
  it('saves and returns a valid contact message', async () => {
    const repository = new InMemoryContactMessageRepository();
    const submitContactMessage = createSubmitContactMessage(repository);

    const contactMessage = await submitContactMessage(createValidDraftContactMessage());

    expect(contactMessage.email).toBe('maria@exemplo.com');
    expect(repository.savedContactMessages).toEqual([contactMessage]);
  });

  it('rejects an invalid draft without saving anything', async () => {
    const repository = new InMemoryContactMessageRepository();
    const submitContactMessage = createSubmitContactMessage(repository);

    await expect(submitContactMessage(EMPTY_DRAFT_CONTACT_MESSAGE)).rejects.toBeInstanceOf(
      InvalidContactMessageError,
    );
    expect(repository.savedContactMessages).toHaveLength(0);
  });

  it('exposes the errors of each invalid field', async () => {
    const submitContactMessage = createSubmitContactMessage(new InMemoryContactMessageRepository());

    const submission = submitContactMessage(createValidDraftContactMessage({ email: 'maria' }));

    await expect(submission).rejects.toMatchObject({ errors: { email: expect.any(String) } });
  });
});
