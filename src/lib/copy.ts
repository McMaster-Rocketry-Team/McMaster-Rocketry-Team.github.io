import type membersData from '../data/members.json';
import { numberWord } from './site';

type MemberStat = (typeof membersData)['stats'][number];
type VehicleData = {
  apogee: number | null;
  mach: number | null;
  specs: Record<string, string | null>;
};

export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? ''));
}

export function payloadsHeadline(count: number, wins: number): string {
  const entries = count === 1 ? 'entry' : 'entries';
  const winWord = wins === 1 ? 'win' : 'wins';
  return `${cap(numberWord(count))} ${entries}, ${numberWord(wins)} ${winWord}`;
}

export function subteamsHeadline(count: number, template: string): string {
  return fill(template, { count: cap(numberWord(count)) });
}

export function membersLede(template: string, stats: MemberStat[]): string {
  const active = stats.find((s) => s.label === 'Active members');
  const faculties = stats.find((s) => s.label === 'Faculties represented');
  const subteamNote = active?.note?.replace(/^across /, '') ?? 'seven subteams';
  return fill(template, {
    members: active?.value ?? '100+',
    subteams: subteamNote,
    faculties: faculties?.value ?? '4',
  });
}

export function vehicleSpecValue(v: VehicleData, field: string): string | null {
  if (field === 'apogee') return v.apogee != null ? v.apogee.toLocaleString() : null;
  if (field === 'mach') return v.mach != null ? `Mach ${v.mach}` : null;
  if (field.startsWith('specs.')) {
    const key = field.slice(6);
    return v.specs[key] ?? null;
  }
  return null;
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
