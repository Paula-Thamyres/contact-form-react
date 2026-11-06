import { useCallback, useLayoutEffect, useState } from 'react';
import type { ThemeGateway } from '../../application/ports/themeGateway';
import { toggleTheme, type Theme } from '../../domain/theme';

export function useTheme(gateway: ThemeGateway) {
  const [theme, setTheme] = useState<Theme>(() => gateway.loadSavedTheme() ?? gateway.detectSystemTheme());

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const switchTheme = useCallback(() => {
    const nextTheme = toggleTheme(theme);
    setTheme(nextTheme);
    gateway.saveTheme(nextTheme);
  }, [gateway, theme]);

  return { theme, switchTheme };
}
