const BASE_CONTROL_CLASS_NAMES =
  'w-full rounded-xl border bg-control-surface px-3 py-2.5 text-ink placeholder:text-control-placeholder focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus-ring';

export function getControlClassName(hasError: boolean): string {
  const borderClassName = hasError ? 'border-danger-border' : 'border-control-border';
  return `${BASE_CONTROL_CLASS_NAMES} ${borderClassName}`;
}
