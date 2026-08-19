import type { Job } from '../types';

export const JOBS: Job[] = [
  { id: 1, company: 'Northwind Analytics', position: 'Frontend Engineer', location: 'Remote', salary: '$110k–$130k', priority: 'high', stage: 'found', tier: 'target', dateFound: '2026-08-01' },
  { id: 2, company: 'Ferrovia Systems', position: 'Product Engineer', location: 'Austin, TX', salary: '$120k–$140k', priority: 'medium', stage: 'applied', tier: 'stretch', dateFound: '2026-07-20', applicationDeadline: '2026-08-25', jobUrl: 'https://example.com/jobs/ferrovia-product-engineer', resumeVersion: 'Resume_v3_Ferrovia' },
  { id: 3, company: 'Lumen Health', position: 'Software Engineer II', location: 'Remote', salary: '$100k–$125k', priority: 'medium', stage: 'applied', dateFound: '2026-07-22' },
  { id: 4, company: 'Argent Robotics', position: 'React Developer', location: 'Denver, CO', salary: '$115k–$135k', priority: 'high', stage: 'screen', tier: 'target', dateFound: '2026-07-10', notes: 'Recruiter mentioned a take-home assignment after this round.' },
  { id: 5, company: 'Cobalt Retail', position: 'Full Stack Engineer', location: 'Remote', salary: '$105k–$120k', priority: 'low', stage: 'technical', tier: 'safe', dateFound: '2026-06-28' },
  { id: 6, company: 'Sable & Finch', position: 'UI Engineer', location: 'Chicago, IL', salary: '$110k–$130k', priority: 'high', stage: 'final', tier: 'stretch', dateFound: '2026-06-15', notes: 'Panel round is 3 interviewers back to back — ask for a short break between.' },
];
