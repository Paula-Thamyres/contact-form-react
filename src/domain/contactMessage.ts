import type { ContactSubjectValue } from './contactSubject';

export const CONTACT_FIELD_NAMES = ['fullName', 'email', 'phoneNumber', 'subject', 'message'] as const;

export type ContactFieldName = (typeof CONTACT_FIELD_NAMES)[number];

export type DraftContactMessage = Readonly<Record<ContactFieldName, string>>;

export type ContactMessageErrors = Readonly<Partial<Record<ContactFieldName, string>>>;

export type ContactMessage = Readonly<{
  fullName: string;
  email: string;
  phoneNumber: string | undefined;
  subject: ContactSubjectValue;
  message: string;
}>;

export const EMPTY_DRAFT_CONTACT_MESSAGE: DraftContactMessage = {
  fullName: '',
  email: '',
  phoneNumber: '',
  subject: '',
  message: '',
};
