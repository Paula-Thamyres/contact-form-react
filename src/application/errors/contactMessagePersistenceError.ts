export class ContactMessagePersistenceError extends Error {
  constructor(cause: unknown) {
    super('Não foi possível salvar a mensagem de contato.', { cause });
    this.name = 'ContactMessagePersistenceError';
  }
}
