export type Stage =
  | 'found'
  | 'applied'
  | 'screen'
  | 'technical'
  | 'final'
  | 'offer';

export type Priority = 'high' | 'medium' | 'low';

export type Tier = 'stretch' | 'target' | 'safe';

export interface Job {
  id: number;
  company: string;
  position: string;
  location: string;
  salary: string;
  priority: Priority;
  stage: Stage;
  // Everything below is OPTIONAL
  // Making them required would fail validation and silently drop old data.
  tier?: Tier;
  jobUrl?: string;
  applicationDeadline?: string; // ISO date string, e.g. '2026-09-01'
  dateFound?: string; // ISO date string
}

export interface ColumnDef {
  id: Stage;
  title: string;
  accent: string;
}
