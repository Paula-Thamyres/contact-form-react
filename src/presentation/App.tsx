import type { ContactUseCases } from '../application/contactUseCases';
import type { ThemeGateway } from '../application/ports/themeGateway';
import { ContactForm } from './components/ContactForm';
import { SentConfirmation } from './components/SentConfirmation';
import { ThemeToggle } from './components/ThemeToggle';
import { useContactForm } from './hooks/useContactForm';
import { useTheme } from './hooks/useTheme';

type AppProperties = {
  useCases: ContactUseCases;
  themeGateway: ThemeGateway;
};

export function App({ useCases, themeGateway }: AppProperties) {
  const form = useContactForm(useCases);
  const { theme, switchTheme } = useTheme(themeGateway);

  return (
    <main className="aurora-background min-h-screen px-4 py-8 sm:py-14">
      <div className="mx-auto mb-4 flex max-w-xl justify-end">
        <ThemeToggle theme={theme} onToggle={switchTheme} />
      </div>
      <div className="glass-card mx-auto max-w-xl p-6 sm:p-8">
        {form.sentContactMessage ? (
          <SentConfirmation contactMessage={form.sentContactMessage} onStartNewMessage={form.startNewMessage} />
        ) : (
          <>
            <h1 className="text-2xl font-semibold text-ink-heading">Entre em contato</h1>
            <p className="mt-2 mb-6 text-ink-muted">Preencha os campos abaixo e envie sua mensagem.</p>
            <ContactForm
              draft={form.draft}
              errors={form.errors}
              invalidSubmissionCount={form.invalidSubmissionCount}
              isSubmitting={form.isSubmitting}
              failureMessage={form.failureMessage}
              onFieldChange={form.changeField}
              onSubmit={form.submit}
            />
          </>
        )}
      </div>
    </main>
  );
}
