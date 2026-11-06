import { extractPhoneNumberDigits, MAXIMUM_PHONE_NUMBER_DIGIT_COUNT } from '../../domain/phoneNumber';

const AREA_CODE_DIGIT_COUNT = 2;
const MOBILE_LEADING_DIGIT = '9';
const LANDLINE_PREFIX_DIGIT_COUNT = 4;
const MOBILE_PREFIX_DIGIT_COUNT = 5;

export function formatPhoneNumber(rawValue: string): string {
  const digits = extractPhoneNumberDigits(rawValue).slice(0, MAXIMUM_PHONE_NUMBER_DIGIT_COUNT);

  if (digits.length === 0) {
    return '';
  }
  if (digits.length <= AREA_CODE_DIGIT_COUNT) {
    return `(${digits}`;
  }

  const areaCode = digits.slice(0, AREA_CODE_DIGIT_COUNT);
  const subscriberNumber = digits.slice(AREA_CODE_DIGIT_COUNT);
  const prefixDigitCount = subscriberNumber.startsWith(MOBILE_LEADING_DIGIT)
    ? MOBILE_PREFIX_DIGIT_COUNT
    : LANDLINE_PREFIX_DIGIT_COUNT;

  if (subscriberNumber.length <= prefixDigitCount) {
    return `(${areaCode}) ${subscriberNumber}`;
  }

  return `(${areaCode}) ${subscriberNumber.slice(0, prefixDigitCount)}-${subscriberNumber.slice(prefixDigitCount)}`;
}
