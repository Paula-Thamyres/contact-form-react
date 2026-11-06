import type { ThemeGateway } from '../application/ports/themeGateway';
import type { Theme } from '../domain/theme';

type InMemoryThemeGatewayOptions = {
  savedTheme?: Theme;
  systemTheme?: Theme;
};

export class InMemoryThemeGateway implements ThemeGateway {
  savedTheme: Theme | undefined;
  private readonly systemTheme: Theme;

  constructor({ savedTheme, systemTheme = 'light' }: InMemoryThemeGatewayOptions = {}) {
    this.savedTheme = savedTheme;
    this.systemTheme = systemTheme;
  }

  loadSavedTheme(): Theme | undefined {
    return this.savedTheme;
  }

  saveTheme(theme: Theme): void {
    this.savedTheme = theme;
  }

  detectSystemTheme(): Theme {
    return this.systemTheme;
  }
}
