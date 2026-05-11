# Agent Mandates - Research POP

This document serves as the primary operational guide for AI agents interacting with this codebase. Adherence to these mandates is non-negotiable to maintain system integrity and UX consistency.

## 1. Technical Mandates

### React & State Management
- **Stability First**: Always use the `EMPTY_ARRAY` constant from `constants.js` for default array dependencies in `useEffect` or `useMemo` to prevent infinite re-render loops.
- **Lazy Registry**: Never import the control registry directly at the top level of a component if it might cause a circular dependency. Use the lazy-initialization pattern established in `registry.jsx`.
- **Stringified Dependencies**: When dealing with complex JSON objects in `useEffect` dependencies, use `JSON.stringify(obj)` to ensure deep comparison.

### Data Persistence
- **Business Isolation**: NEVER perform a query or mutation without an explicit `business_id` (usually retrieved from `localStorage`).
- **Strategy Pattern**: All service calls must go through `schemaService.js` to honor the dual-mode persistence strategy (API vs. LocalStorage).

## 2. UI & Aesthetic Mandates

### Professionalism & Terminology
- **Terminology**: Use **"ข้อมูล" (Data)** instead of "รายการ" (Items). This applies to counters, buttons, toast messages, and placeholders.
- **Icons**: Prefer professional SVG icons (Heroicons/Lucide style) over emojis for primary actions (Delete, Edit, Save).
- **Destructive UI**: Delete buttons must follow the "Soft Red" strategy:
    - Default: Subtle/Translucent (`rgba(231, 76, 60, 0.4)`).
    - Hover: Solid Bright Red (`#e74c3c`).
    - Alignment: Always use `align-items: center` in flex containers to ensure buttons are vertically centered.

### UX Patterns
- **Validation**: Implement "On-Blur" validation. Errors and red borders should only appear after the field has been "Touched" (Focus Out).
- **Feedback**: Every async action MUST be followed by a `showToast` feedback (success/error).

## 3. Workflow & Verification
- **Playwright Verification**: For any UI/Alignment change, create/run a temporary Playwright script (e.g., `check_alignment.mjs`) to verify the fix via screenshot before finalizing.
- **Commit Strategy**: Group logical changes into descriptive commits. Do not force push unless explicitly directed by the user after a rejected non-fast-forward push.
