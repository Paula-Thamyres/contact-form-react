import { describe, expect, it } from 'vitest';
import { isTheme, toggleTheme } from './theme';

describe('theme', () => {
  it.each(['light', 'dark'])('recognizes %s as a theme', (candidate) => {
    expect(isTheme(candidate)).toBe(true);
  });

  it.each(['', 'Dark', 'blue', null, undefined, 1])('rejects %s', (candidate) => {
    expect(isTheme(candidate)).toBe(false);
  });

  it('toggles between light and dark', () => {
    expect(toggleTheme('light')).toBe('dark');
    expect(toggleTheme('dark')).toBe('light');
  });
});
