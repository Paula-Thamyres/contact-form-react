import type { ContactMessage } from '../../domain/contactMessage';

export interface ContactMessageRepository {
  save(contactMessage: ContactMessage): Promise<void>;
}
