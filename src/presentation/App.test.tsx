import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import type { ContactUseCases } from '../application/contactUseCases';
import { ContactMessagePersistenceError } from '../application/errors/contactMessagePersistenceError';
import type { ContactMessageRepository } from '../application/ports/contactMessageRepository';
import type { ThemeGateway } from '../application/ports/themeGateway';
import { createSubmitContactMessage } from '../application/useCases/submitContactMessage';
import { InMemoryContactMessageRepository } from '../testing/inMemoryContactMessageRepository';
import { InMemoryThemeGateway } from '../testing/inMemoryThemeGateway';
import { App } from './App';

type RenderAppOptions = {
  repository?: ContactMessageRepository;
  themeGateway?: ThemeGateway;
};

function renderApp({
  repository = new InMemoryContactMessageRepository(),
  themeGateway = new InMemoryThemeGateway(),
}: RenderAppOptions = {}) {
  const useCases: ContactUseCases = { submit: createSubmitContactMessage(repository) };
  render(<App useCases={useCases} themeGateway={themeGateway} />);
  return userEvent.setup();
}

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Nome completo'), 'Maria da Silva');
  await user.type(screen.getByLabelText('E-mail'), 'maria@exemplo.com');
  await user.selectOptions(screen.getByLabelText('Assunto'), 'Sugestão');
  await user.type(screen.getByLabelText('Mensagem'), 'Gostaria de enviar uma sugestão sobre o projeto.');
}

describe('App', () => {
  afterEach(() => {
    cleanup();
    delete document.documentElement.dataset.theme;
  });

  it('shows the errors and focuses the first invalid field when submitting an empty form', async () => {
    const user = renderApp();

    await user.click(screen.getByRole('button', { name: 'Enviar mensagem' }));

    expect(screen.getByText('Informe seu nome completo.')).toBeTruthy();
    expect(screen.getByText('Informe seu e-mail.')).toBeTruthy();
    expect(screen.getByText('Escolha um assunto.')).toBeTruthy();
    expect(screen.getByText('Escreva sua mensagem.')).toBeTruthy();
    expect(document.activeElement).toBe(screen.getByLabelText('Nome completo'));
  });

  it('marks invalid fields for assistive technology', async () => {
    const user = renderApp();

    await user.click(screen.getByRole('button', { name: 'Enviar mensagem' }));

    expect(screen.getByLabelText('E-mail').getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByLabelText('E-mail').getAttribute('aria-describedby')).toContain('contact-email-error');
  });

  it('clears the error of a field as soon as it is edited', async () => {
    const user = renderApp();

    await user.click(screen.getByRole('button', { name: 'Enviar mensagem' }));
    await user.type(screen.getByLabelText('E-mail'), 'a');

    expect(screen.queryByText('Informe seu e-mail.')).toBeNull();
    expect(screen.getByText('Informe seu nome completo.')).toBeTruthy();
  });

  it('rejects an invalid e-mail address', async () => {
    const user = renderApp();
    await fillValidForm(user);
    await user.clear(screen.getByLabelText('E-mail'));
    await user.type(screen.getByLabelText('E-mail'), 'maria@');

    await user.click(screen.getByRole('button', { name: 'Enviar mensagem' }));

    expect(screen.getByText('Informe um e-mail válido, como nome@exemplo.com.')).toBeTruthy();
  });

  it('applies the phone mask while typing', async () => {
    const user = renderApp();

    await user.type(screen.getByLabelText(/Telefone/), '19912345678');

    expect(screen.getByLabelText<HTMLInputElement>(/Telefone/).value).toBe('(19) 91234-5678');
  });

  it('shows the character counter of the message', async () => {
    const user = renderApp();

    await user.type(screen.getByLabelText('Mensagem'), 'Olá');

    expect(screen.getByText('3/1000')).toBeTruthy();
  });

  it('sends a valid form, saves it and shows the confirmation', async () => {
    const repository = new InMemoryContactMessageRepository();
    const user = renderApp({ repository });
    await fillValidForm(user);

    await user.click(screen.getByRole('button', { name: 'Enviar mensagem' }));

    expect(await screen.findByRole('heading', { name: 'Mensagem enviada' })).toBeTruthy();
    expect(screen.getByText(/Obrigado pelo contato, Maria\./)).toBeTruthy();
    expect(repository.savedContactMessages).toHaveLength(1);
    expect(repository.savedContactMessages[0]?.subject).toBe('suggestion');
  });

  it('returns to an empty form to send another message', async () => {
    const user = renderApp();
    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: 'Enviar mensagem' }));

    await user.click(await screen.findByRole('button', { name: 'Enviar outra mensagem' }));

    expect(screen.getByLabelText<HTMLInputElement>('Nome completo').value).toBe('');
  });

  it('keeps the filled values and warns when saving fails', async () => {
    const failingRepository: ContactMessageRepository = {
      save: async () => {
        throw new ContactMessagePersistenceError(new Error('storage unavailable'));
      },
    };
    const user = renderApp({ repository: failingRepository });
    await fillValidForm(user);

    await user.click(screen.getByRole('button', { name: 'Enviar mensagem' }));

    expect((await screen.findByRole('alert')).textContent).toBe(
      'Não foi possível enviar sua mensagem. Tente novamente em instantes.',
    );
    expect(screen.getByLabelText<HTMLInputElement>('Nome completo').value).toBe('Maria da Silva');
  });

  describe('theme', () => {
    it('uses the system theme when no preference was saved', () => {
      renderApp({ themeGateway: new InMemoryThemeGateway({ systemTheme: 'dark' }) });

      expect(document.documentElement.dataset.theme).toBe('dark');
    });

    it('prefers the saved theme over the system theme', () => {
      renderApp({ themeGateway: new InMemoryThemeGateway({ savedTheme: 'light', systemTheme: 'dark' }) });

      expect(document.documentElement.dataset.theme).toBe('light');
    });

    it('switches the theme, updates the button label and saves the preference', async () => {
      const themeGateway = new InMemoryThemeGateway({ systemTheme: 'light' });
      const user = renderApp({ themeGateway });

      await user.click(screen.getByRole('button', { name: 'Mudar para o tema escuro' }));

      expect(document.documentElement.dataset.theme).toBe('dark');
      expect(themeGateway.savedTheme).toBe('dark');

      await user.click(screen.getByRole('button', { name: 'Mudar para o tema claro' }));

      expect(document.documentElement.dataset.theme).toBe('light');
      expect(themeGateway.savedTheme).toBe('light');
    });

    it('keeps the filled fields when the theme changes', async () => {
      const user = renderApp();
      await user.type(screen.getByLabelText('Nome completo'), 'Maria da Silva');

      await user.click(screen.getByRole('button', { name: 'Mudar para o tema escuro' }));

      expect(screen.getByLabelText<HTMLInputElement>('Nome completo').value).toBe('Maria da Silva');
    });
  });
});
