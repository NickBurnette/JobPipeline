import { useEffect, useState } from 'react';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { COLUMNS } from '../../constants';
import { JOBS } from '../../data/mockJobs';
import { loadJobs, saveJobs } from '../../storage/jobStorage';
import type { Job, Stage } from '../../types';
import Column from '../Column/Column';
import AddJobForm from '../AddJobForm/AddJobForm';
import JobDetailModal from '../JobDetailModal/JobDetailModal';
import DataControls from '../DataControls/DataControls';
import './Board.css';

type NewJobInput = Omit<Job, 'id' | 'stage' | 'dateFound'>;

export default function Board() {
  // The FUNCTION FORM of useState: `() => loadJobs() ?? JOBS` instead of
  // just `loadJobs() ?? JOBS`. If we wrote it the plain way, that expression
  // would run on every single render, hitting localStorage every time even
  // though React only ever uses the result once. Passing a function means
  // React only calls it on the very first render — the "lazy initializer" pattern,
  // worth reaching for whenever the initial value is expensive to compute
  // or (like here) has a real side effect.
  const [jobs, setJobs] = useState<Job[]>(() => loadJobs() ?? JOBS);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);

  // Whenever `jobs` changes — add, edit, drag, import — write it back to localStorage.
  useEffect(() => {
    saveJobs(jobs);
  }, [jobs]);

  // Require 8px of pointer movement before dnd-kit treats it as a drag.
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  function handleStageChange(jobId: number, newStage: Stage) {
    setJobs((prevJobs) => {
      const job = prevJobs.find((j) => j.id === jobId);
      if (!job) return prevJobs;

      const updatedJob: Job = { ...job, stage: newStage };
      // Drop it from wherever it was, then add it at the END of the array.
      // Since each column just filters this array in order, "last in the
      // array" becomes "last in its new column" — no separate ordering
      // field needed for this.
      return [...prevJobs.filter((j) => j.id !== jobId), updatedJob];
    });
  }

  function handleAddJob(newJob: NewJobInput) {
    setJobs((prevJobs) => {
      const nextId = Math.max(0, ...prevJobs.map((job) => job.id)) + 1;
      const job: Job = {
        ...newJob,
        id: nextId,
        stage: 'found',
        // toISOString() gives a full timestamp with time and a 'Z' suffix;
        // slicing the first 10 characters grabs just 'YYYY-MM-DD'.
        dateFound: new Date().toISOString().slice(0, 10),
      };
      return [...prevJobs, job];
    });
  }

  function handleUpdateJob(updatedJob: Job) {
    setJobs((prevJobs) => {
      const existing = prevJobs.find((job) => job.id === updatedJob.id);
      const stageChanged = existing && existing.stage !== updatedJob.stage;

      if (stageChanged) {
        // Changed stage from the modal — move it to the end of its new
        // column too, same as a drag would.
        return [
          ...prevJobs.filter((job) => job.id !== updatedJob.id),
          updatedJob,
        ];
      }

      // Every other edit (company, salary, priority...) updates in place
      // and does NOT reorder anything — only a stage change should move a card.
      return prevJobs.map((job) =>
        job.id === updatedJob.id ? updatedJob : job
      );
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const jobId = active.id as number;
    const newStage = over.id as Stage;
    handleStageChange(jobId, newStage);
  }

  function handleDeleteJob(jobId: number) {
    setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
  }

  // Look up the full job object from its id every render, rather than
  // storing the whole job in state — that way if a drag or the dropdown
  // changes its stage while the modal is closed, we're never showing stale data.
  const selectedJob = jobs.find((job) => job.id === selectedJobId) ?? null;

  return (
    <div className="board-wrap">
      <div className="board-header">
        <h1>Job Pipeline</h1>
        <p>Drag a card to move it, or click one for details</p>
      </div>
      <div className="board-toolbar">
        <AddJobForm onAddJob={handleAddJob} />
        <DataControls jobs={jobs} onImport={setJobs} />
      </div>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="board">
          {COLUMNS.map((column) => (
            <Column
              key={column.id}
              column={column}
              jobs={jobs}
              onOpenDetail={setSelectedJobId}
            />
          ))}
        </div>
      </DndContext>
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJobId(null)}
          onSave={handleUpdateJob}
          onDelete={handleDeleteJob}
        />
      )}
    </div>
  );
}
