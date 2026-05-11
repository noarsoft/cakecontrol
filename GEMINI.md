# Research POP - Project Guidelines

## Architecture Overview
This project is a metadata-driven dynamic application composed of:
1. **CakeControl (Frontend)**: React 19 + Vite 7.
2. **RootID (Backend)**: Node.js Express + Prisma (PostgreSQL).

## Data Strategy (Dual-Mode)
The application implements a **Dual-Mode Data Strategy** to ensure high availability:
- **🟢 API Mode (Production/Primary)**: Connects to the real Backend API on port 3002. Data is persisted in PostgreSQL.
- **🟡 Fallback Mode (Development/Offline)**: Automatically activates if the API is unreachable. Data is stored in the browser's `localStorage`.
- **Note**: Look for the status indicator in the Sidebar. If it says "API Offline", you are in Fallback Mode.

## Tech Stack
- **Frontend**: React 19, Vite 7, Vanilla CSS, Playwright (E2E), Jest (Unit).
- **Backend**: Express, Prisma, PostgreSQL.

## Core Mandates & Engineering Standards
1. **Multi-tenancy**: All data (Schemas, Forms, Data) MUST be filtered by `business_id`.
2. **Versioning**: Every update to a Schema, View, or Form creates a new record with a `prev_id`, preserving the `rootid`.
3. **Form Rendering**: `schemaTransform.js` handles the bridge between DB JSON and Dynamic Controls.
4. **Validation**: All data entry (Modals/Pages) must use **On-Blur validation** (touched state) to provide a polished UX.

## Common Commands
### Backend (rootid)
```powershell
npm run dev      # Start server with nodemon
npm test         # Run unit & integration tests
npx prisma studio # View DB content
```

### Frontend (cakecontrol)
```powershell
npm run dev      # Start Vite dev server
npm test         # Run Jest tests
node check_modal.mjs # Run Playwright UI checks
```

## UI & UX Standards
- **Terminology**: Standardize all user-facing labels to use **"ข้อมูล" (Data)** instead of "รายการ" (Items) to ensure clarity and professional tone.
- **Destructive Actions**: Use a **"Soft Red"** strategy for delete buttons (subtle/translucent by default, bright red on hover). Use SVG icons (not emojis) for professional UI.
- **Global Theme Switcher**: Positioned fixed at `bottom: 24px, right: 24px, z-index: 9999` to remain accessible across all views.
- **Validation**: Mandatory "On-Blur" (Touched state) validation for all builders and data entry forms.

## Maintenance Notes
- **registry.jsx**: Uses Lazy-Initialization to avoid ESM circular dependency crashes.
- **useCRUDState.js**: Uses `EMPTY_ARRAY` constant to prevent infinite render loops in effects.
- **schemaService.js**: Implements a strategy pattern with a 1.5s health-check timeout for automatic localStorage fallback.
