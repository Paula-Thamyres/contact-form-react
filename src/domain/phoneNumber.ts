export const MAXIMUM_PHONE_NUMBER_DIGIT_COUNT = 11;

const MOBILE_PHONE_NUMBER_PATTERN = /^[1-9]{2}9\d{8}$/;
const LANDLINE_PHONE_NUMBER_PATTERN = /^[1-9]{2}[2-5]\d{7}$/;

export function extractPhoneNumberDigits(value: string): string {
  return value.replace(/\D/g, '');
}

export function isValidBrazilianPhoneNumber(digits: string): boolean {
  return MOBILE_PHONE_NUMBER_PATTERN.test(digits) || LANDLINE_PHONE_NUMBER_PATTERN.test(digits);
}
