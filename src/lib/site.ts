import site from '../data/site.json';

const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];

export function numberWord(n: number): string {
  return WORDS[n] !== undefined ? WORDS[n] : String(n);
}

// Mirrors render.js's mailHref/mailBadge. Renders the real address now that
// site.email is filled in; falls back to a visible TODO badge if it is ever
// unset again, so a dead contact route never looks like a working one.
export function mailHref(subject?: string): string {
  const addr = site.email || 'TODO@macrocketry.ca';
  return 'mailto:' + addr + (subject ? '?subject=' + encodeURIComponent(subject) : '');
}

export function hasRealEmail(): boolean {
  return Boolean(site.email);
}
