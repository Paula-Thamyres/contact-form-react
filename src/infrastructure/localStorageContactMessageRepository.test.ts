import { describe, expect, it } from 'vitest';
import { ContactMessagePersistenceError } from '../application/errors/contactMessagePersistenceError';
import type { ContactMessage } from '../domain/contactMessage';
import { LocalStorageContactMessageRepository, type StorageGateway } from './localStorageContactMessageRepository';

const FIRST_CONTACT_MESSAGE: ContactMessage = {
  fullName: 'Maria da Silva',
  email: 'maria@exemplo.com',
  phoneNumber: undefined,
  subject: 'support',
  message: 'Preciso de ajuda com o meu acesso.',
};

const SECOND_CONTACT_MESSAGE: ContactMessage = { ...FIRST_CONTACT_MESSAGE, fullName: 'João Pereira' };

type FakeStorage = StorageGateway & { content: string | null };

function createFakeStorage(initialContent: string | null = null): FakeStorage {
  const storage: FakeStorage = {
    content: initialContent,
    getItem: () => storage.content,
    setItem: (_key, value) => {
      storage.content = value;
    },
  };
  return storage;
}

function readStoredMessages(content: string | null): unknown {
  return JSON.parse(content ?? 'null');
}

describe('LocalStorageContactMessageRepository', () => {
  it('stores the first message in a new list', async () => {
    const storage = createFakeStorage();
    const repository = new LocalStorageContactMessageRepository(() => storage);

    await repository.save(FIRST_CONTACT_MESSAGE);

    expect(readStoredMessages(storage.content)).toEqual([FIRST_CONTACT_MESSAGE]);
  });

  it('appends new messages after the existing ones', async () => {
    const storage = createFakeStorage();
    const repository = new LocalStorageContactMessageRepository(() => storage);

    await repository.save(FIRST_CONTACT_MESSAGE);
    await repository.save(SECOND_CONTACT_MESSAGE);

    expect(readStoredMessages(storage.content)).toEqual([FIRST_CONTACT_MESSAGE, SECOND_CONTACT_MESSAGE]);
  });

  it('starts a new list when the stored content is corrupted', async () => {
    const storage = createFakeStorage('{broken');
    const repository = new LocalStorageContactMessageRepository(() => storage);

    await repository.save(FIRST_CONTACT_MESSAGE);

    expect(readStoredMessages(storage.content)).toEqual([FIRST_CONTACT_MESSAGE]);
  });

  it('starts a new list when the stored content is not a list', async () => {
    const storage = createFakeStorage('{"unexpected":true}');
    const repository = new LocalStorageContactMessageRepository(() => storage);

    await repository.save(FIRST_CONTACT_MESSAGE);

    expect(readStoredMessages(storage.content)).toEqual([FIRST_CONTACT_MESSAGE]);
  });

  it('translates storage failures into a persistence error', async () => {
    const repository = new LocalStorageContactMessageRepository(() => {
      throw new Error('storage unavailable');
    });

    await expect(repository.save(FIRST_CONTACT_MESSAGE)).rejects.toBeInstanceOf(ContactMessagePersistenceError);
  });
});
