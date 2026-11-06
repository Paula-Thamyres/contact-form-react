import type { ReactNode } from 'react';
import type { ContactFieldName } from '../../domain/contactMessage';

export type FormControlProperties = {
  id: string;
  'aria-invalid': boolean;
  'aria-describedby': string | undefined;
};

type FormFieldProperties = {
  fieldName: ContactFieldName;
  label: string;
  isOptional?: boolean;
  hint?: string;
  errorMessage: string | undefined;
  children: (controlProperties: FormControlProperties) => ReactNode;
};

export function getFieldElementIdentifier(fieldName: ContactFieldName): string {
  return `contact-${fieldName}`;
}

export function FormField({ fieldName, label, isOptional = false, hint, errorMessage, children }: FormFieldProperties) {
  const controlIdentifier = getFieldElementIdentifier(fieldName);
  const errorIdentifier = `${controlIdentifier}-error`;
  const hintIdentifier = `${controlIdentifier}-hint`;

  const describedByIdentifiers = [
    errorMessage ? errorIdentifier : undefined,
    hint ? hintIdentifier : undefined,
  ].filter((identifier) => identifier !== undefined);

  return (
    <div>
      <label htmlFor={controlIdentifier} className="mb-1.5 block text-sm font-medium text-ink-label">
        {label}
        {isOptional && <span className="ml-1 font-normal text-ink-hint">(opcional)</span>}
      </label>
      {children({
        id: controlIdentifier,
        'aria-invalid': errorMessage !== undefined,
        'aria-describedby': describedByIdentifiers.length > 0 ? describedByIdentifiers.join(' ') : undefined,
      })}
      {errorMessage && (
        <p id={errorIdentifier} className="mt-1.5 text-sm text-danger">
          {errorMessage}
        </p>
      )}
      {hint && (
        <p id={hintIdentifier} className="mt-1.5 text-right text-xs text-ink-hint">
          {hint}
        </p>
      )}
    </div>
  );
}
