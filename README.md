# Job Pipeline

A Kanban-style job search tracker, built as a hands-on project for learning React and TypeScript from the ground up.

## Features

- Drag-and-drop Kanban board (`@dnd-kit`) across six pipeline stages: Found, Applied, Recruiter Screen, Technical Interview, Final Interview, Offer
- Click any card to view and edit full job details in a modal
- Add new jobs through a modal form
- Local persistence — your data survives a page refresh (`localStorage`), with no backend required
- Export your data to a JSON file and import it back in — own your data, no account needed

## Tech stack

- React 19 + TypeScript
- Vite
- `@dnd-kit` for drag-and-drop
- Plain CSS with custom properties for theming (dark mode planned)

## Getting started

```bash
npm install
npm run dev
```

## Roadmap

- [ ] Light/dark theme toggle
- [ ] Custom-styled dropdown (replacing native `<select>` for full cross-browser styling control)
- [ ] Drag-to-reorder within a column
- [ ] Touch device refinement
- [ ] Keyboard drag flow polish + screen reader announcements
- [ ] Optional hosted account (login + database) alongside the local-only mode

## Why this exists

Built as a learning project to go from zero React experience to a real, working tool — while actually using it for an active job search along the way.
