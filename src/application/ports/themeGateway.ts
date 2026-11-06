import type { Theme } from '../../domain/theme';

export interface ThemeGateway {
  loadSavedTheme(): Theme | undefined;
  saveTheme(theme: Theme): void;
  detectSystemTheme(): Theme;
}
