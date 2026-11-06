import { useEffect, useRef } from 'react';
import type { ContactMessage } from '../../domain/contactMessage';

type SentConfirmationProperties = {
  contactMessage: ContactMessage;
  onStartNewMessage: () => void;
};

function extractFirstName(fullName: string): string {
  return fullName.split(' ')[0] ?? fullName;
}

export function SentConfirmation({ contactMessage, onStartNewMessage }: SentConfirmationProperties) {
  const headingReference = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingReference.current?.focus();
  }, []);

  return (
    <section aria-labelledby="sent-confirmation-title">
      <h2
        id="sent-confirmation-title"
        ref={headingReference}
        tabIndex={-1}
        className="text-xl font-semibold text-ink-heading focus:outline-none"
      >
        Mensagem enviada
      </h2>
      <p className="mt-2 text-ink-muted">
        Obrigado pelo contato, {extractFirstName(contactMessage.fullName)}. Sua mensagem foi registrada.
      </p>
      <button
        type="button"
        onClick={onStartNewMessage}
        className="mt-6 cursor-pointer rounded-full border border-accent-text px-6 py-3 font-medium text-accent-text transition-colors hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
      >
        Enviar outra mensagem
      </button>
    </section>
  );
}
