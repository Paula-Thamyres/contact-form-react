import { describe, expect, it } from 'vitest';
import { BrowserThemeGateway, type ThemeStorage } from './browserThemeGateway';

type FakeStorage = ThemeStorage & { content: string | null };

function createFakeStorage(initialContent: string | null = null): FakeStorage {
  const storage: FakeStorage = {
    content: initialContent,
    getItem: () => storage.content,
    setItem: (_key, value) => {
      storage.content = value;
    },
  };
  return storage;
}

function createFailingStorage(): ThemeStorage {
  const failure = () => {
    throw new Error('storage unavailable');
  };
  return { getItem: failure, setItem: failure };
}

describe('BrowserThemeGateway', () => {
  describe('loadSavedTheme', () => {
    it.each(['light', 'dark'] as const)('returns the saved %s theme', (savedTheme) => {
      const gateway = new BrowserThemeGateway(() => createFakeStorage(savedTheme), () => false);

      expect(gateway.loadSavedTheme()).toBe(savedTheme);
    });

    it('returns undefined when nothing was saved', () => {
      const gateway = new BrowserThemeGateway(() => createFakeStorage(), () => false);

      expect(gateway.loadSavedTheme()).toBeUndefined();
    });

    it('returns undefined when the saved value is not a theme', () => {
      const gateway = new BrowserThemeGateway(() => createFakeStorage('purple'), () => false);

      expect(gateway.loadSavedTheme()).toBeUndefined();
    });

    it('returns undefined when the storage is unavailable', () => {
      const gateway = new BrowserThemeGateway(createFailingStorage, () => false);

      expect(gateway.loadSavedTheme()).toBeUndefined();
    });
  });

  describe('saveTheme', () => {
    it('stores the theme so it can be loaded again', () => {
      const storage = createFakeStorage();
      const gateway = new BrowserThemeGateway(() => storage, () => false);

      gateway.saveTheme('dark');

      expect(gateway.loadSavedTheme()).toBe('dark');
    });

    it('does not throw when the storage is unavailable', () => {
      const gateway = new BrowserThemeGateway(createFailingStorage, () => false);

      expect(() => gateway.saveTheme('dark')).not.toThrow();
    });
  });

  describe('detectSystemTheme', () => {
    it('returns dark when the system prefers a dark color scheme', () => {
      const gateway = new BrowserThemeGateway(() => createFakeStorage(), () => true);

      expect(gateway.detectSystemTheme()).toBe('dark');
    });

    it('returns light when the system does not prefer a dark color scheme', () => {
      const gateway = new BrowserThemeGateway(() => createFakeStorage(), () => false);

      expect(gateway.detectSystemTheme()).toBe('light');
    });

    it('returns light when the preference cannot be read', () => {
      const gateway = new BrowserThemeGateway(
        () => createFakeStorage(),
        () => {
          throw new Error('matchMedia unavailable');
        },
      );

      expect(gateway.detectSystemTheme()).toBe('light');
    });
  });
});
