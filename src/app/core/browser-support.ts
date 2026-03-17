export interface ApiCheck {
  name: string;
  check: () => boolean;
  errorMessage: string;
}

export const API_CHECKS: ApiCheck[] = [
  {
    name: 'Web Audio API',
    check: () => {
      const AudioContextClass =
        (window as any).AudioContext || (window as any).webkitAudioContext;
      return !!AudioContextClass;
    },
    errorMessage: 'Web Audio API is not supported in this browser.',
  },
];

export function validateBrowserSupport(): string[] {
  const errors: string[] = [];

  for (const api of API_CHECKS) {
    if (!api.check()) {
      errors.push(api.errorMessage);
    }
  }

  return errors;
}
