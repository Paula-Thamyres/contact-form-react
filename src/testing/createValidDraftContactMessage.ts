import type { DraftContactMessage } from '../domain/contactMessage';

export function createValidDraftContactMessage(overrides: Partial<DraftContactMessage> = {}): DraftContactMessage {
  return {
    fullName: 'Maria da Silva',
    email: 'maria@exemplo.com',
    phoneNumber: '(19) 91234-5678',
    subject: 'question',
    message: 'Gostaria de saber mais detalhes sobre o projeto.',
    ...overrides,
  };
}
