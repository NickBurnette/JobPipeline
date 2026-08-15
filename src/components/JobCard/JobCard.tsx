import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { Job } from '../../types';
import { PRIORITY_LABEL, TIER_LABEL } from '../../constants';
import './JobCard.css';

interface JobCardProps {
  job: Job;
  onOpenDetail: (jobId: number) => void;
}

export default function JobCard({ job, onOpenDetail }: JobCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: job.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="job-card"
      onClick={() => onOpenDetail(job.id)}
    >
      <div className="job-card-top">
        <div className="job-card-top-left">
          <span
            className={`priority-dot priority-${job.priority}`}
            title={PRIORITY_LABEL[job.priority]}
          />
          <span className="job-company">{job.company}</span>
        </div>
        {job.tier && (
          <span className={`tier-badge tier-badge-${job.tier}`}>
            {TIER_LABEL[job.tier]}
          </span>
        )}
      </div>
      <div className="job-position">{job.position}</div>
      <div className="job-meta">
        <span>{job.location}</span>
        <span className="job-meta-dot">·</span>
        <span>{job.salary}</span>
      </div>
    </div>
  );
}
