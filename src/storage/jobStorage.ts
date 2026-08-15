import { COLUMNS } from '../constants';
import type { Job, Stage } from '../types';

const STORAGE_KEY = 'job-pipeline-jobs';

// The list of valid stages, derived from COLUMNS
// COLUMNS is the single source of truth for what stages exist.
const VALID_STAGES: Stage[] = COLUMNS.map((column) => column.id);

// A type guard: unlike `as Job`, this inspects the value at
// runtime and returns true/false. This is what lets us safely parse JSON from localStorage
function isValidJob(value: unknown): value is Job {
  if (typeof value !== 'object' || value === null) return false;
  const job = value as Record<string, unknown>;

  const requiredFieldsValid =
    typeof job.id === 'number' &&
    typeof job.company === 'string' &&
    typeof job.position === 'string' &&
    typeof job.location === 'string' &&
    typeof job.salary === 'string' &&
    (job.priority === 'high' ||
      job.priority === 'medium' ||
      job.priority === 'low') &&
    VALID_STAGES.includes(job.stage as Stage);

  // Optional fields: valid if either ABSENT or the right type.
  const optionalFieldsValid =
    (job.tier === undefined ||
      job.tier === 'stretch' ||
      job.tier === 'target' ||
      job.tier === 'safe') &&
    (job.jobUrl === undefined || typeof job.jobUrl === 'string') &&
    (job.applicationDeadline === undefined ||
      typeof job.applicationDeadline === 'string') &&
    (job.dateFound === undefined || typeof job.dateFound === 'string');

  return requiredFieldsValid && optionalFieldsValid;
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
