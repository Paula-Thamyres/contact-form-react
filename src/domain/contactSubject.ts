export const CONTACT_SUBJECTS = [
  { value: 'question', label: 'Dúvida' },
  { value: 'suggestion', label: 'Sugestão' },
  { value: 'support', label: 'Suporte' },
  { value: 'partnership', label: 'Parceria' },
] as const;

export type ContactSubject = (typeof CONTACT_SUBJECTS)[number];
export type ContactSubjectValue = ContactSubject['value'];

export function isContactSubjectValue(candidate: unknown): candidate is ContactSubjectValue {
  return CONTACT_SUBJECTS.some((subject) => subject.value === candidate);
}
