import { useRef, type ChangeEvent } from 'react';
import type { Job } from '../../types';
import { isValidJobArray } from '../../storage/jobStorage';
import './DataControls.css';

interface DataControlsProps {
  jobs: Job[];
  onImport: (jobs: Job[]) => void;
}

export default function DataControls({ jobs, onImport }: DataControlsProps) {
  // A ref to the actual <input type="file"> DOM node. Unlike useState,
  // updating a ref does NOT cause a re-render — it's just a persistent box
  // to hold onto something across renders. We use it here purely to call
  // the browser's real .click() on a file input we've hidden, so our own
  // styled button can trigger the native file picker.
  const importInputRef = useRef<HTMLInputElement>(null);

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

      onImport(parsed);
    } catch {
      alert('Could not read that file — is it valid JSON?');
    } finally {
      e.target.value = ''; // reset so importing the same file again still fires onChange
    }
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
    </div>
  );
}
