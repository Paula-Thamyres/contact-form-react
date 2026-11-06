import { ContactMessagePersistenceError } from '../application/errors/contactMessagePersistenceError';
import type { ContactMessageRepository } from '../application/ports/contactMessageRepository';
import type { ContactMessage } from '../domain/contactMessage';

export type StorageGateway = Pick<Storage, 'getItem' | 'setItem'>;

const STORAGE_KEY = 'contact-form-react:contact-messages';

function parseStoredContactMessages(serializedContactMessages: string | null): unknown[] {
  if (serializedContactMessages === null) {
    return [];
  }

  try {
    const parsedValue: unknown = JSON.parse(serializedContactMessages);
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    return [];
  }
}

export class LocalStorageContactMessageRepository implements ContactMessageRepository {
  private readonly resolveStorage: () => StorageGateway;

  constructor(resolveStorage: () => StorageGateway) {
    this.resolveStorage = resolveStorage;
  }

  async save(contactMessage: ContactMessage): Promise<void> {
    try {
      const storage = this.resolveStorage();
      const storedContactMessages = parseStoredContactMessages(storage.getItem(STORAGE_KEY));
      storage.setItem(STORAGE_KEY, JSON.stringify([...storedContactMessages, contactMessage]));
    } catch (cause) {
      throw new ContactMessagePersistenceError(cause);
    }
  }
}
