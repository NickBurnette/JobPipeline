import { useRef, useState, type ChangeEvent } from 'react';
import type { Job } from '../../types';
import { isValidJobArray } from '../../storage/jobStorage';
import Modal from '../Modal/Modal';
import './DataControls.css';

interface DataControlsProps {
  jobs: Job[];
  onImport: (jobs: Job[]) => void;
}

export default function DataControls({ jobs, onImport }: DataControlsProps) {
  // A ref to the actual <input type="file"> DOM node. Unlike useState,
  // updating a ref does NOT cause a re-render — it's just a persistent box
  // to hold onto something across renders. Used here purely to call
  // the browser's real .click() on the hidden file input, so the
  // styled button can trigger the native file picker.
  const importInputRef = useRef<HTMLInputElement>(null);

  // Holds the parsed, ALREADY-VALIDATED jobs from a picked file while
  // waiting for the user to confirm. Nothing in Board's real data changes
  // until they explicitly say yes.
  const [pendingImport, setPendingImport] = useState<Job[] | null>(null);

  function handleExport() {
    const blob = new Blob([JSON.stringify(jobs, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'job-pipeline-export.json';
    link.click();

    URL.revokeObjectURL(url); // release the temporary URL once used
  }

  async function handleImportChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed: unknown = JSON.parse(text);

      if (!isValidJobArray(parsed)) {
        alert("That file doesn't look like a valid job export.");
        return;
      }

      // Valid — but don't apply it yet. This REPLACES every job currently
      // saved, so it needs a confirmation step.
      setPendingImport(parsed);
    } catch {
      alert('Could not read that file — is it valid JSON?');
    } finally {
      e.target.value = ''; // reset so importing the same file again still fires onChange
    }
  }

  function confirmImport() {
    if (!pendingImport) return;
    onImport(pendingImport);
    setPendingImport(null);
  }

  return (
    <div className="data-controls">
      <button onClick={handleExport}>Export</button>
      <button onClick={() => importInputRef.current?.click()}>Import</button>
      <input
        type="file"
        accept="application/json"
        ref={importInputRef}
        onChange={handleImportChange}
        className="data-controls-file-input"
      />

      {pendingImport && (
        <Modal onClose={() => setPendingImport(null)}>
          <div className="import-confirm">
            <h2 className="modal-form-title">Replace your current data?</h2>
            <p className="import-confirm-text">
              This file has <strong>{pendingImport.length}</strong>{' '}
              job{pendingImport.length === 1 ? '' : 's'}. Importing it will
              replace all <strong>{jobs.length}</strong> job
              {jobs.length === 1 ? '' : 's'} you currently have saved. This
              can't be undone.
            </p>
            <div className="modal-form-actions">
              <button
                type="button"
                className="btn-danger"
                onClick={confirmImport}
              >
                Replace my data
              </button>
              <button
                type="button"
                onClick={() => setPendingImport(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
