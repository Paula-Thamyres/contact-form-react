import type { ContactUseCases } from './application/contactUseCases';
import { createSubmitContactMessage } from './application/useCases/submitContactMessage';
import { BrowserThemeGateway } from './infrastructure/browserThemeGateway';
import { LocalStorageContactMessageRepository } from './infrastructure/localStorageContactMessageRepository';

const contactMessageRepository = new LocalStorageContactMessageRepository(() => window.localStorage);

export const contactUseCases: ContactUseCases = {
  submit: createSubmitContactMessage(contactMessageRepository),
};

export const themeGateway = new BrowserThemeGateway(
  () => window.localStorage,
  () => window.matchMedia('(prefers-color-scheme: dark)').matches,
);
