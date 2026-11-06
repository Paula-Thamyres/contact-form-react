import type { ContactMessageErrors } from '../../domain/contactMessage';

export class InvalidContactMessageError extends Error {
  readonly errors: ContactMessageErrors;

  constructor(errors: ContactMessageErrors) {
    super('Os dados do formulário de contato são inválidos.');
    this.name = 'InvalidContactMessageError';
    this.errors = errors;
  }
}
