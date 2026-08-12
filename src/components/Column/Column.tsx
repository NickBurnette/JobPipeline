import { useDroppable } from '@dnd-kit/core';
import type { ColumnDef, Job } from '../../types';
import JobCard from '../JobCard/JobCard';
import './Column.css';

interface ColumnProps {
  column: ColumnDef;
  jobs: Job[];
  onOpenDetail: (jobId: number) => void;
}

export default function Column({ column, jobs, onOpenDetail }: ColumnProps) {
  const columnJobs = jobs.filter((job) => job.stage === column.id);
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div className="column">
      <div className="column-header" style={{ borderColor: column.accent }}>
        <span className="column-title">{column.title}</span>
        <span className="column-count">{columnJobs.length}</span>
      </div>
      <div
        ref={setNodeRef}
        className={`column-body${isOver ? ' column-body-over' : ''}`}
      >
        {columnJobs.length === 0 ? (
          <div className="column-empty">No jobs here yet</div>
        ) : (
          columnJobs.map((job) => (
            <JobCard key={job.id} job={job} onOpenDetail={onOpenDetail} />
          ))
        )}
      </div>
    </div>
  );
}
