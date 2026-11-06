import { describe, expect, it } from 'vitest';
import { formatPhoneNumber } from './formatPhoneNumber';

describe('formatPhoneNumber', () => {
  it.each([
    ['', ''],
    ['1', '(1'],
    ['19', '(19'],
    ['199', '(19) 9'],
    ['1991234', '(19) 91234'],
    ['19991234567', '(19) 99123-4567'],
    ['1934567890', '(19) 3456-7890'],
    ['19912345678', '(19) 91234-5678'],
    ['199123456789999', '(19) 91234-5678'],
    ['(19) 91234-5678', '(19) 91234-5678'],
    ['abc19x912', '(19) 912'],
  ])('formats %s as %s', (rawValue, expectedValue) => {
    expect(formatPhoneNumber(rawValue)).toBe(expectedValue);
  });
});
