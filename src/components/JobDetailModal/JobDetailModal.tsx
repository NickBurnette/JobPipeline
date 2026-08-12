import { useState, type SubmitEvent } from 'react';
import type { Job, Priority, Stage } from '../../types';
import { COLUMNS, PRIORITY_OPTION_STYLE } from '../../constants';
import Modal from '../Modal/Modal';
import './JobDetailModal.css';

interface JobDetailModalProps {
  job: Job;
  onClose: () => void;
  onSave: (job: Job) => void;
}

export default function JobDetailModal({
  job,
  onClose,
  onSave,
}: JobDetailModalProps) {
  // Seeded from the job passed in — this is a LOCAL draft. Nothing in
  // Board's real `jobs` state changes until Save is clicked.
  const [form, setForm] = useState<Job>(job);

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.company.trim() || !form.position.trim()) return;

    onSave(form);
    onClose();
  }

  return (
    <Modal onClose={onClose}>
      <form className="modal-form" onSubmit={handleSubmit}>
        <div className="modal-form-header">
          <h2 className="modal-form-title">Job details</h2>
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

        <div className="modal-form-actions">
          <button type="submit">Save changes</button>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </div>
      </form>
    </Modal>
  );
}
