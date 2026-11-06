import type { SubmitContactMessage } from './useCases/submitContactMessage';

export type ContactUseCases = {
  readonly submit: SubmitContactMessage;
};
