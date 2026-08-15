import type { CSSProperties } from 'react';
import type { ColumnDef, Priority, Tier } from './types';

export const COLUMNS: ColumnDef[] = [
  { id: 'found', title: 'Found', accent: '#5B7FA6' },
  { id: 'applied', title: 'Applied', accent: '#4C8C7A' },
  { id: 'screen', title: 'Recruiter Screen', accent: '#C98A3C' },
  { id: 'technical', title: 'Technical Interview', accent: '#C9743C' },
  { id: 'final', title: 'Final Interview', accent: '#B85C6B' },
  { id: 'offer', title: 'Offer', accent: '#3C9A5F' },
];

export const PRIORITY_LABEL: Record<Priority, string> = {
  high: 'High priority',
  medium: 'Medium priority',
  low: 'Low priority',
};

// Used to color each <option> individually — see AddJobForm for why
// this can't just live in a CSS class the way the closed select box does.
export const PRIORITY_OPTION_STYLE: Record<Priority, CSSProperties> = {
  high: { backgroundColor: '#fdf0e6', color: '#a8582b' },
  medium: { backgroundColor: '#fdf4e7', color: '#9c6a1f' },
  low: { backgroundColor: '#edf5ee', color: '#4f7a4b' },
};

export const TIER_LABEL: Record<Tier, string> = {
  stretch: 'Stretch',
  target: 'Target',
  safe: 'Safe',
};

export const TIER_OPTION_STYLE: Record<Tier, CSSProperties> = {
  stretch: { backgroundColor: '#f1edf9', color: '#6b5ca5' },
  target: { backgroundColor: '#e9f5ed', color: '#2f7a4f' },
  safe: { backgroundColor: '#eef0f2', color: '#5c6773' },
};

// A plain ISO date string ('2026-09-01') isn't nice to read — this turns
// it into something like 'Sep 1, 2026'. Returns '—' for missing dates so
// callers don't need their own empty-state check everywhere.
export function formatDate(iso: string | undefined): string {
  if (!iso) return '—';
  // Appending a time avoids the browser interpreting a bare date as
  // midnight UTC and then displaying it as the PREVIOUS day in timezones behind UTC
  const date = new Date(`${iso}T00:00:00`);
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
