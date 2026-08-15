import { useState, type SubmitEvent } from 'react';
import type { Job, Priority, Stage, Tier } from '../../types';
import {
  COLUMNS,
  PRIORITY_OPTION_STYLE,
  TIER_OPTION_STYLE,
} from '../../constants';
import Modal from '../Modal/Modal';
import './JobDetailModal.css';

interface JobDetailModalProps {
  job: Job;
  onClose: () => void;
  onSave: (job: Job) => void;
  onDelete: (jobId: number) => void;
}

export default function JobDetailModal({
  job,
  onClose,
  onSave,
  onDelete,
}: JobDetailModalProps) {
  // Seeded from the job passed in — this is a LOCAL draft. Nothing in
  // Board's real `jobs` state changes until Save is clicked.
  const [form, setForm] = useState<Job>(job);

  // A second piece of local state, same idea as `isOpen` back in the Modal
  // component: a boolean that controls which of two things this component
  // renders. Here it swaps the delete button for an inline confirmation.
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.company.trim() || !form.position.trim()) return;

    onSave(form);
    onClose();
  }

  function handleDelete() {
    onDelete(job.id);
    onClose();
  }

  return (
    <Modal onClose={onClose}>
      <form className="modal-form" onSubmit={handleSubmit}>
        <div className="modal-form-header">
          <h2 className="modal-form-title">Job details</h2>
          <div className="modal-form-badges">
            <select
              className={`tier-select tier-select-${form.tier ?? 'unset'}`}
              value={form.tier ?? ''}
              onChange={(e) =>
                setForm({
                  ...form,
                  tier: e.target.value === '' ? undefined : (e.target.value as Tier),
                })
              }
            >
              <option value="">No tier</option>
              <option value="stretch" style={TIER_OPTION_STYLE.stretch}>
                Stretch
              </option>
              <option value="target" style={TIER_OPTION_STYLE.target}>
                Target
              </option>
              <option value="safe" style={TIER_OPTION_STYLE.safe}>
                Safe
              </option>
            </select>
            <select
              className={`priority-select priority-select-${form.priority}`}
              value={form.priority}
              onChange={(e) =>
                setForm({ ...form, priority: e.target.value as Priority })
              }
            >
              <option value="high" style={PRIORITY_OPTION_STYLE.high}>
                High priority
              </option>
              <option value="medium" style={PRIORITY_OPTION_STYLE.medium}>
                Medium priority
              </option>
              <option value="low" style={PRIORITY_OPTION_STYLE.low}>
                Low priority
              </option>
            </select>
          </div>
        </div>

        <div className="modal-form-row">
          <input
            type="text"
            placeholder="Company"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Position"
            value={form.position}
            onChange={(e) => setForm({ ...form, position: e.target.value })}
            required
          />
        </div>
        <div className="modal-form-row">
          <input
            type="text"
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
          <input
            type="text"
            placeholder="Salary range"
            value={form.salary}
            onChange={(e) => setForm({ ...form, salary: e.target.value })}
          />
        </div>

        <div className="modal-form-row">
          <input
            type="url"
            placeholder="Job posting URL"
            value={form.jobUrl ?? ''}
            onChange={(e) => setForm({ ...form, jobUrl: e.target.value })}
          />
        </div>
        {form.jobUrl && (
          // target="_blank" opens a new tab; rel="noopener noreferrer" is a
          // security habit worth having automatically — without it, the
          // page linked to gets a live JS reference back to this tab (window.opener) 
          // and could redirect it.
          <a
            href={form.jobUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="detail-open-link"
          >
            Open posting ↗
          </a>
        )}

        <div className="modal-form-row">
          <label className="detail-date-field">
            <span>Date found</span>
            <input
              type="date"
              value={form.dateFound ?? ''}
              onChange={(e) => setForm({ ...form, dateFound: e.target.value })}
            />
          </label>
          <label className="detail-date-field">
            <span>Application deadline</span>
            <input
              type="date"
              value={form.applicationDeadline ?? ''}
              onChange={(e) =>
                setForm({ ...form, applicationDeadline: e.target.value })
              }
            />
          </label>
        </div>

        <div className="detail-stage">
          <span className="detail-stage-label">Stage</span>
          <select
            className="detail-stage-select"
            value={form.stage}
            onChange={(e) =>
              setForm({ ...form, stage: e.target.value as Stage })
            }
          >
            {COLUMNS.map((column) => (
              <option key={column.id} value={column.id}>
                {column.title}
              </option>
            ))}
          </select>
        </div>

        <div className="modal-form-footer">
          <div
            className={`delete-warning${
              confirmingDelete ? ' delete-warning-open' : ''
            }`}
          >
            Delete this job?
          </div>
          <div className="modal-form-footer-row">
            <div className="delete-actions">
              {confirmingDelete ? (
                <span className="delete-confirm-buttons">
                  <button
                    type="button"
                    className="btn-danger"
                    onClick={handleDelete}
                  >
                    Yes, delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmingDelete(false)}
                  >
                    Cancel
                  </button>
                </span>
              ) : (
                <button
                  type="button"
                  className="btn-danger"
                  onClick={() => setConfirmingDelete(true)}
                >
                  Delete job
                </button>
              )}
            </div>

            <div className="modal-form-actions">
              <button type="submit">Save</button>
              <button type="button" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
}
