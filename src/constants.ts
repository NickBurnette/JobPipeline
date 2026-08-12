import type { CSSProperties } from 'react';
import type { ColumnDef, Priority } from './types';

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
// backgroundColor lacks a light versus dark mode. This will need to be reworked later.
export const PRIORITY_OPTION_STYLE: Record<Priority, CSSProperties> = {
  high: { backgroundColor: '#16171d', color: '#a83e2b' },
  medium: { backgroundColor: '#16171d', color: '#9c6a1f' },
  low: { backgroundColor: '#16171d', color: '#4f7a4b' },
};