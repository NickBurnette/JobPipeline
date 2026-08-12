import { COLUMNS } from '../constants';
import type { Job, Stage } from '../types';

const STORAGE_KEY = 'job-pipeline-jobs';

// The list of valid stages, derived from COLUMNS rather than duplicated —
// COLUMNS is already the single source of truth for what stages exist.
const VALID_STAGES: Stage[] = COLUMNS.map((column) => column.id);

// A type guard: unlike `as Job`, this actually inspects the value at
// runtime and returns true/false. TypeScript narrows the type to `Job`
// whenever this returns true — it's not just telling the compiler to
// trust us, it's proving it.
function isValidJob(value: unknown): value is Job {
  if (typeof value !== 'object' || value === null) return false;
  const job = value as Record<string, unknown>;

  return (
    typeof job.id === 'number' &&
    typeof job.company === 'string' &&
    typeof job.position === 'string' &&
    typeof job.location === 'string' &&
    typeof job.salary === 'string' &&
    (job.priority === 'high' ||
      job.priority === 'medium' ||
      job.priority === 'low') &&
    VALID_STAGES.includes(job.stage as Stage)
  );
}

export function isValidJobArray(data: unknown): data is Job[] {
  return Array.isArray(data) && data.every(isValidJob);
}

// Returns null if there's nothing saved yet, or if what's saved is
// corrupted/invalid — callers decide what to fall back to in that case.
export function loadJobs(): Job[] | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    return isValidJobArray(parsed) ? parsed : null;
  } catch {
    return null; // malformed JSON — treat the same as "nothing saved"
  }
}

export function saveJobs(jobs: Job[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
}
