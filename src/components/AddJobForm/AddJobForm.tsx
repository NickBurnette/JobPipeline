import { useState, type SubmitEvent } from 'react';
import type { Job, Priority } from '../../types';
import { PRIORITY_OPTION_STYLE } from '../../constants';
import Modal from '../Modal/Modal';
import './AddJobForm.css';

// The data this form collects — everything about a Job EXCEPT
// id and stage, since those get assigned automatically on submit.
type NewJobInput = Omit<Job, 'id' | 'stage'>;

interface AddJobFormProps {
  onAddJob: (job: NewJobInput) => void;
}

const EMPTY_FORM: NewJobInput = {
  company: '',
  position: '',
  location: '',
  salary: '',
  priority: 'medium',
};

export default function AddJobForm({ onAddJob }: AddJobFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<NewJobInput>(EMPTY_FORM);

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault(); // stop the browser's default full-page-reload submit
    if (!form.company.trim() || !form.position.trim()) return;

    onAddJob(form);
    setForm(EMPTY_FORM);
    setIsOpen(false);
  }

  function handleClose() {
    setForm(EMPTY_FORM);
    setIsOpen(false);
  }

  return (
    <>
      <button className="add-job-toggle" onClick={() => setIsOpen(true)}>
        + Add Job
      </button>

      {isOpen && (
        <Modal onClose={handleClose}>
          <form className="modal-form" onSubmit={handleSubmit}>
            <div className="modal-form-header">
              <h2 className="modal-form-title">Add a job</h2>
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
            <div className="modal-form-actions">
              <button type="submit">Add job</button>
              <button type="button" onClick={handleClose}>
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
