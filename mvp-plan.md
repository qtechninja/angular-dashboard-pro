# MVP Plan: Angular Dashboard Pro

## Description
A polished Angular 17+ dashboard demo showcasing REST & GraphQL API consumption, responsive UI with Bootstrap, and modern frontend best practices.

## Tech Stack
- **frontend**: Angular 17 + TypeScript + Bootstrap 5 + SCSS
- **backend**: Node.js + Express + GraphQL (Apollo Server)
- **database**: SQLite (better-sqlite3)
- **testing**: Playwright

## Features
1. Interactive dashboard with real-time data widgets — charts, KPIs, and activity feed consuming both REST and GraphQL endpoints
2. User management CRUD table — sortable, filterable data table with inline editing, pagination, and responsive Bootstrap layout
3. REST + GraphQL API layer — dual API architecture demonstrating proficiency with both integration patterns
4. Dark/light theme toggle with SCSS variables — showcases CSS3/SASS expertise and cross-browser compatibility awareness
5. Performance optimized lazy loading — route-level code splitting and OnPush change detection demonstrating Angular best practices

## Pages
- Dashboard
- Users
- API Explorer
- Settings

## API Endpoints
- GET /api/users
- GET /api/users/:id
- POST /api/users
- PUT /api/users/:id
- DELETE /api/users/:id
- GET /api/dashboard/stats
- GET /api/dashboard/activity
- POST /graphql

## Data Models
### User
Fields: id, name, email, role, status, lastLogin, createdAt, updatedAt

### Activity
Fields: id, userId, action, resource, details, createdAt

### DashboardStat
Fields: id, label, value, change, period, updatedAt
