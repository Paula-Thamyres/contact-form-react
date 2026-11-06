import type { ThemeGateway } from '../application/ports/themeGateway';
import { isTheme, type Theme } from '../domain/theme';

export type ThemeStorage = Pick<Storage, 'getItem' | 'setItem'>;

const STORAGE_KEY = 'contact-form-react:theme';

export class BrowserThemeGateway implements ThemeGateway {
  private readonly resolveStorage: () => ThemeStorage;
  private readonly prefersDarkColorScheme: () => boolean;

  constructor(resolveStorage: () => ThemeStorage, prefersDarkColorScheme: () => boolean) {
    this.resolveStorage = resolveStorage;
    this.prefersDarkColorScheme = prefersDarkColorScheme;
  }

  loadSavedTheme(): Theme | undefined {
    try {
      const savedTheme = this.resolveStorage().getItem(STORAGE_KEY);
      return isTheme(savedTheme) ? savedTheme : undefined;
    } catch {
      return undefined;
    }
  }

  saveTheme(theme: Theme): void {
    try {
      this.resolveStorage().setItem(STORAGE_KEY, theme);
    } catch {
      return;
    }
  }

  detectSystemTheme(): Theme {
    try {
      return this.prefersDarkColorScheme() ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  }
}
