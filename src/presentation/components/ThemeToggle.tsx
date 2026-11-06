import type { Theme } from '../../domain/theme';

type ThemeToggleProperties = {
  theme: Theme;
  onToggle: () => void;
};

function SunIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  );
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProperties) {
  const isDarkTheme = theme === 'dark';
  const accessibleName = isDarkTheme ? 'Mudar para o tema claro' : 'Mudar para o tema escuro';

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={accessibleName}
      title={accessibleName}
      className="grid size-11 cursor-pointer place-items-center rounded-full border border-card-border bg-toggle-surface text-ink-heading backdrop-blur transition-colors hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
    >
      {isDarkTheme ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
