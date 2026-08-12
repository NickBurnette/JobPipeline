export type Stage =
  | 'found'
  | 'applied'
  | 'screen'
  | 'technical'
  | 'final'
  | 'offer';

export type Priority = 'high' | 'medium' | 'low';

export interface Job {
  id: number;
  company: string;
  position: string;
  location: string;
  salary: string;
  priority: Priority;
  stage: Stage;
}

export interface ColumnDef {
  id: Stage;
  title: string;
  accent: string;
}
