interface ToNumberOptions {
  default?: number;
  min?: number;
  max?: number;
}

export function toBoolean(
  value: string | boolean = '',
  defaultValue?: boolean,
): boolean | undefined {
  switch (value) {
    case 'true':
    case 'yes':
    case '1':
      return true;

    case 'false':
    case 'no':
    case '0':
      return false;
  }

  if (typeof value === 'boolean') return value;

  return defaultValue;
}

export function toNumber(value: string, opts: ToNumberOptions = {}): number {
  let newValue: number = Number.parseInt(value || String(opts.default), 10);

  if (Number.isNaN(newValue)) {
    newValue = opts.default;
  }

  if (opts.min) {
    if (newValue < opts.min) {
      newValue = opts.min;
    }

    if (newValue > opts.max) {
      newValue = opts.max;
    }
  }

  return newValue;
}

export function toStringArray(string: string) {
  if (Array.isArray(string)) return string;

  return string?.split(',') || [];
}
