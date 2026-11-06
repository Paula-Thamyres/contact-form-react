import type { ContactMessageRepository } from '../application/ports/contactMessageRepository';
import type { ContactMessage } from '../domain/contactMessage';

export class InMemoryContactMessageRepository implements ContactMessageRepository {
  readonly savedContactMessages: ContactMessage[] = [];

  async save(contactMessage: ContactMessage): Promise<void> {
    this.savedContactMessages.push(contactMessage);
  }
}
