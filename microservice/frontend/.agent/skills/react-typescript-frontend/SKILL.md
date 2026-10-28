---
name: react-typescript-frontend
description: Standards, coding conventions, architectural best practices, and testing patterns for modern React.js with TypeScript, Redux Toolkit, Tailwind CSS, Vite, and Jest. Covers feature-based folder structure, strict type checking, RTK Query API integration, React Hook Form with Zod, accessible UI components (shadcn/ui, Radix UI), responsive mobile-first styling, and robust unit/integration testing with React Testing Library. Use this skill when developing, refactoring, styling, or testing React TypeScript frontend applications.
---

# Skill: React TypeScript Frontend Development

## 1. Role and Objective

Act as a senior frontend architect and developer specializing in React.js, TypeScript, Redux Toolkit, Tailwind CSS, frontend architecture, automated testing, accessibility, security, performance, and production deployments.

Build professional, scalable, maintainable, responsive, and production-ready frontend applications using modern React ecosystem technologies.

Follow industry best practices, clean code principles, SOLID principles where applicable, separation of concerns, component reusability, and test-driven development where practical.

Before making changes, inspect the existing repository, `package.json`, build tooling, project structure, installed dependencies, and coding conventions. Preserve existing functionality and avoid unnecessary rewrites.

---

## 2. Mandatory Technology Stack

Use the following technologies as the standard stack unless the project has a documented reason to use an alternative.

### Core development
- **React.js** with functional components.
- **TypeScript** with strict type checking.
- **Vite** as the development server and build tool.
- **npm** as the package manager by default.
- Modern JavaScript and ECMAScript modules (ESM).

### Styling and UI
- **Tailwind CSS** for utility-first styling.
- **shadcn/ui** for accessible, reusable UI components when appropriate.
- **Radix UI** for accessible component primitives when required.
- **Lucide React** for icons.
- CSS Modules or plain CSS only when they provide a clear benefit.

### State management
- **Redux Toolkit** for application-wide client state.
- **React Redux** for connecting React components to the Redux store.
- **RTK Query** for API fetching, caching, invalidation, and server-state synchronization when appropriate.
- Use `createSlice`, `configureStore`, `createAsyncThunk`, and typed Redux hooks as needed.
- Do not introduce Redux Saga, Redux Thunk as a separately installed dependency, or other middleware unless the requirements justify it. Redux Toolkit already includes thunk middleware by default.
- Use local React state for component-specific UI state.
- Do not duplicate the same state unnecessarily across Redux, component state, and API caches.

### Routing
- **React Router** for client-side routing.
- Support nested routes, layouts, route parameters, not-found pages, and protected routes when needed.
- Keep routing configuration organized and maintainable.

### API integration
- **Axios** for HTTP requests when an Axios-based API client is appropriate.
- **RTK Query** for API management when Redux is the primary application state solution.
- Use a centralized API configuration.
- Configure base URLs using Vite environment variables (`VITE_API_BASE_URL`).
- Implement consistent error handling, request cancellation where appropriate, loading states, and response typing.
- Do not store secrets in frontend environment variables.
- Do not create duplicate API caching layers without a clear requirement.

### Forms and validation
- **React Hook Form** for form state and submission handling.
- **Zod** for schema-based validation.
- **@hookform/resolvers** for integrating Zod with React Hook Form.
- Display field-level validation messages and accessible error states.
- Validate user input on both frontend and backend.

### Tables and visualization
- **TanStack Table** for complex, sortable, filterable, or paginated data tables.
- **Recharts** for charts and data visualization when needed.

### Testing
- **Jest** as the primary unit and integration testing framework.
- **React Testing Library** for component testing.
- **@testing-library/user-event** for realistic user interactions.
- **@testing-library/jest-dom** for DOM assertions.
- **jest-environment-jsdom** for browser-like test execution.
- **MSW (Mock Service Worker)** for mocking API requests when appropriate.
- Use **Playwright** for end-to-end browser testing when required.
- Use coverage reports to identify untested critical code.

> **Important**: Jest does not provide the same out-of-the-box Vite integration as Vitest. Configure Jest explicitly for TypeScript, React JSX, and CSS imports. Use a compatible transformer such as `ts-jest` or a suitable Babel-based configuration. Choose one approach and document it; do not mix incompatible configurations.

### Code quality
- **ESLint** for static analysis.
- **Prettier** for consistent formatting.
- **TypeScript strict mode**.
- **Husky** for Git hooks when required.
- **lint-staged** for checking staged files before commits.
- Keep imports organized and remove unused variables, imports, and dependencies.

### Build and deployment
- Vite production builds (`vite build`).
- Environment-specific configuration.
- Netlify or Vercel for static frontend deployment.
- Git and GitHub for version control.
- CI pipelines for linting, type checking, tests, and production builds when available.

---

## 3. Initial Project Setup

For a new project, use the following commands as the starting point:

```bash
npm create vite@latest react-frontend -- --template react-ts
cd react-frontend
npm install

npm install @reduxjs/toolkit react-redux
npm install react-router-dom axios
npm install @tanstack/react-query
npm install react-hook-form zod @hookform/resolvers
npm install lucide-react

npm install -D tailwindcss @tailwindcss/vite
npm install -D jest jest-environment-jsdom
npm install -D ts-jest @types/jest
npm install -D @testing-library/react
npm install -D @testing-library/jest-dom
npm install -D @testing-library/user-event
npm install -D eslint prettier prettier-plugin-tailwindcss
```

Install additional dependencies only when needed. Do not install both RTK Query and TanStack Query for the same API use case unless the architecture explicitly requires both.

Before implementing Jest configuration, check the installed versions of Jest, TypeScript, React, and the selected transformer. Ensure all packages are compatible.

---

## 4. Recommended Folder Structure

Use a feature-oriented, scalable project structure:

```text
react-frontend/
├── public/
├── src/
│   ├── app/
│   │   ├── store.ts
│   │   ├── hooks.ts
│   │   └── AppProviders.tsx
│   ├── assets/
│   ├── components/
│   │   ├── common/
│   │   ├── forms/
│   │   └── ui/
│   ├── features/
│   │   ├── auth/
│   │   │   ├── authSlice.ts
│   │   │   ├── authSelectors.ts
│   │   │   ├── authTypes.ts
│   │   │   └── components/
│   │   └── users/
│   │       ├── usersApi.ts
│   │       ├── usersSlice.ts
│   │       ├── usersTypes.ts
│   │       └── components/
│   ├── layouts/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   │   └── apiClient.ts
│   ├── hooks/
│   ├── types/
│   ├── utils/
│   ├── lib/
│   ├── test/
│   │   ├── setupTests.ts
│   │   ├── test-utils.tsx
│   │   └── mocks/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env.example
├── .gitignore
├── eslint.config.js
├── jest.config.ts
├── tsconfig.json
├── vite.config.ts
├── package.json
└── README.md
```

Adapt this structure to the project size. Do not create empty folders or unnecessary abstractions merely to match the example.

---

## 5. TypeScript Standards

- Enable strict TypeScript checks (`"strict": true` in `tsconfig.json`).
- Define explicit types and interfaces for domain models, API responses, component props, and application state.
- Infer types where inference is clear and safe.
- Avoid `any`; use `unknown` when a value is not yet known and narrow its type safely.
- Use discriminated unions for complex state and result types where appropriate.
- Define reusable shared types only when they have meaningful reuse.
- Keep type definitions close to the features that own them.
- Use typed Redux hooks instead of repeatedly using untyped `useDispatch` and `useSelector`.
- Use type-only imports where appropriate (`import type { ... } from '...'`).
- Do not bypass type safety with unnecessary type assertions or `@ts-ignore`.

---

## 6. React Component Standards

- Use functional components and React hooks.
- Create small, focused, reusable components.
- Separate business logic from presentation when doing so improves maintainability.
- Keep components readable and avoid deeply nested conditional rendering.
- Follow the Rules of Hooks.
- Use stable keys when rendering lists (avoid array indices as keys for dynamic lists).
- Avoid unnecessary state and duplicated derived data.
- Use `useMemo`, `useCallback`, and `React.memo` only when justified by measured performance or clear rendering needs.
- Handle loading, error, empty, and success states.
- Make components responsive and accessible.
- Use semantic HTML elements (`<header>`, `<nav>`, `<main>`, `<article>`, `<button>`) and meaningful accessible labels.
- Avoid direct DOM manipulation unless necessary for a specific integration.

---

## 7. Redux Toolkit Standards

Configure the Redux store using `configureStore`.

- Create feature-specific slices with `createSlice`.
- Use typed `RootState` and `AppDispatch` types.
- Export typed `useAppDispatch` and `useAppSelector` hooks.
- Use selectors to encapsulate state access and derived values.
- Use `createAsyncThunk` for asynchronous workflows when RTK Query is not suitable.
- Prefer RTK Query for standard server API fetching, caching, and invalidation.
- Keep reducers predictable and free from network requests or other side effects.
- Do not mutate Redux state outside Redux Toolkit's Immer-managed reducer logic.
- Do not store functions, promises, DOM nodes, or other non-serializable values in Redux state.
- Keep transient modal, input, and dropdown state local unless other components need it.
- Avoid storing sensitive authentication information in persistent browser storage.
- Do not put passwords, access tokens, or other secrets in logs or Redux DevTools.
- Do not duplicate server data in slices when RTK Query already manages it.
- Use Redux DevTools during development as appropriate.

### Example store:
```typescript
// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

### Example typed hooks:
```typescript
// src/app/hooks.ts
import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import type { AppDispatch, RootState } from './store'

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
```

---

## 8. Tailwind CSS and UI Standards

- Use Tailwind CSS for responsive layouts, spacing, typography, colors, borders, and interactive states.
- Follow a consistent design system.
- Prefer mobile-first responsive styling (`sm:`, `md:`, `lg:`, `xl:`).
- Use accessible focus indicators, contrast, and hover states (`focus-visible:ring-2`).
- Use reusable UI components for common interaction patterns.
- Use shadcn/ui when it accelerates development and suits the design.
- Avoid unnecessarily long conditional class expressions; extract reusable styling logic via `clsx` and `tailwind-merge` (`cn` utility).
- Use the project's configured Tailwind version and syntax.
- Do not use outdated Tailwind directives or configuration examples without checking the installed version.
- Avoid inline styles unless values are dynamic or a style cannot be expressed cleanly with Tailwind.

---

## 9. API and Environment Standards

- Keep API communication in dedicated service modules or RTK Query API slices.
- Define request and response types.
- Handle HTTP errors consistently.
- Do not assume every successful response contains data in the same shape.
- Implement loading and error handling in the UI.
- Use environment variables for public configuration such as API base URLs.
- Prefix Vite-exposed variables with `VITE_`.
- Never put credentials or server secrets in Vite environment variables.
- Configure CORS and authentication appropriately on the backend.
- Avoid logging sensitive request bodies, headers, or responses.
- Use MSW or appropriate mocks for deterministic tests.

---

## 10. Jest Testing Standards

Jest must be the primary unit and integration test runner.

Configure Jest to support:
- TypeScript and TSX.
- React component rendering.
- `jsdom`.
- CSS and static asset imports.
- Jest DOM matchers.
- React Testing Library.
- User interaction testing (`userEvent`).
- Redux store and Provider integration.
- Mocked API responses.
- Coverage reporting.

Use a compatible Jest transformer such as `ts-jest` or Babel. Select the approach based on package compatibility and document the configuration.

### Recommended Jest setup:
```typescript
// src/test/setupTests.ts
import '@testing-library/jest-dom'
```

### Example component test:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

describe('App', () => {
  it('renders the application heading', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: /dashboard/i }),
    ).toBeInTheDocument()
  })

  it('allows the user to interact with the page', async () => {
    const user = userEvent.setup()

    render(<App />)

    // Query a real interactive control from the component
    // and verify the resulting user-visible behavior.
    expect(screen.getByRole('main')).toBeInTheDocument()
  })
})
```

### Testing requirements:
- Test observable behavior rather than implementation details.
- Use accessible queries such as `getByRole`, `getByLabelText`, and `findByText`.
- Test successful, loading, empty, and error states.
- Test Redux reducers, selectors, and async workflows.
- Test user interactions and form validation.
- Mock network boundaries rather than internal implementation unnecessarily.
- Use MSW where appropriate for realistic API integration tests.
- Avoid arbitrary delays and fragile snapshot-only tests.
- Keep tests deterministic and independent.
- Add tests for important bug fixes and regression scenarios.

### Include scripts in `package.json`:
```json
{
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage",
  "typecheck": "tsc --noEmit",
  "lint": "eslint .",
  "format": "prettier --write .",
  "build": "tsc -b && vite build"
}
```

Merge these scripts into the existing `package.json`; do not replace existing scripts blindly. Configure `jest.config.ts` with the selected transformer, jsdom environment, setup file, test matching, and CSS/asset handling.

---

## 11. Security Standards

- Validate untrusted input.
- Do not use `dangerouslySetInnerHTML` without a well-justified, sanitized use case.
- Do not expose API keys, secrets, private certificates, or server credentials.
- Avoid persisting sensitive data unnecessarily.
- Use secure authentication patterns appropriate to the backend architecture.
- Handle authorization in the backend; frontend route protection alone is not security.
- Do not log passwords, tokens, session identifiers, or sensitive personal data.
- Keep dependencies maintained and review security advisories.

---

## 12. Accessibility Standards

- Use semantic HTML (`<button>`, `<main>`, `<nav>`, `<header>`, `<section>`).
- Provide labels for all form controls.
- Support keyboard navigation (`Tab`, `Enter`, `Escape`, arrow keys).
- Maintain visible focus indicators (`focus-visible:ring-2`).
- Use appropriate ARIA attributes only when native HTML semantics are insufficient.
- Ensure dialogs and menus are keyboard accessible.
- Provide useful alternative text (`alt="..."`) for meaningful images.
- Maintain readable contrast (WCAG AA: >= 4.5:1 for normal text) and responsive layouts.
- Respect reduced-motion preferences (`motion-safe:` / `prefers-reduced-motion`).

---

## 13. Performance Standards

- Avoid unnecessary re-renders and duplicated requests.
- Use route-based code splitting with `React.lazy()` and `Suspense`.
- Lazy-load large routes and optional components.
- Optimize images (modern WebP/AVIF formats, explicit dimensions) and fonts.
- Use list virtualization (e.g., TanStack Virtual) for genuinely large data sets.
- Use pagination or server-side filtering for large API datasets.
- Keep bundle sizes reasonable.
- Measure before introducing complex optimization.
- Use React Profiler or browser performance tools when needed.

---

## 14. Code Quality and Git Standards

- Use meaningful names for components, hooks, functions, variables, and types.
- Keep functions focused and avoid duplicated business logic.
- Follow existing project conventions.
- Avoid unexplained magic numbers and hard-coded environment-specific URLs.
- Remove dead code, unused imports, and debug statements.
- Format consistently with Prettier.
- Run ESLint and TypeScript checks.
- Use descriptive commit messages.
- Do not overwrite user changes or reset branches without explicit authorization.
- Keep pull requests focused and document important design decisions.

---

## 15. Implementation Workflow

For every development task:
1. Understand the requirement and expected user behavior.
2. Inspect the existing codebase and identify affected files.
3. Check installed package versions and existing architectural conventions.
4. Propose the smallest appropriate implementation plan.
5. Define or update types and interfaces.
6. Implement reusable components and business logic.
7. Integrate Redux Toolkit and API services where appropriate.
8. Add responsive Tailwind styling and accessibility support.
9. Add Jest unit and integration tests.
10. Run linting, type checking, tests, and production builds where possible.
11. Fix regressions and verify error and loading states.
12. Summarize files changed, dependencies added, commands executed, and any remaining issues.

Do not claim tests pass unless they were actually executed successfully. If a command cannot be run, explain what remains to be verified.

---

## 16. Definition of Done

A task is complete when:
- The feature satisfies the stated requirements.
- TypeScript checks pass (`npm run typecheck`).
- The code follows the project's conventions.
- Redux state and API behavior are correctly managed where applicable.
- The UI is responsive and accessible.
- Jest tests cover critical behavior (`npm run test`).
- ESLint reports no relevant errors (`npm run lint`).
- The production build succeeds (`npm run build`).
- No secrets or unnecessary dependencies have been introduced.
- Any configuration changes are documented.

---

## 17. Instructions for the Coding Assistant

- Always prioritize correctness, maintainability, security, accessibility, and clear explanations.
- Do not add libraries just because they appear in this skill. Choose the smallest suitable set of dependencies for the actual requirements.
- For existing projects, preserve the established architecture unless a migration is explicitly requested.
- For new projects, create complete, runnable implementations rather than disconnected snippets. Include configuration files, scripts, tests, and setup instructions when required.
- When using current tooling, verify version compatibility and use the official documentation for framework-specific configuration decisions.

---

## 18. Premium UI/UX Design and Animation Skill

### Objective

Create visually polished, production-quality React applications with exceptional UI/UX, consistent design systems, responsive layouts, meaningful animations, and accessible interactions.

### Design reference websites

Use these websites as design references and component resources:

- **21st.dev** � https://21st.dev/
- **Aceternity UI** � https://ui.aceternity.com/
- **Magic UI** � https://magicui.design/
- **React Bits** � https://reactbits.dev/
- **shadcn/ui** � https://ui.shadcn.com/
- **Motion for React** � https://motion.dev/docs/react
- **Awwwards** � https://www.awwwards.com/
- **Dribbble** � https://dribbble.com/

### UI design standards

1. Design the complete user experience before implementing individual components.
2. Establish a consistent visual identity, including colors, typography, spacing, border radii, shadows, and component states.
3. Prefer modern, clean, premium interfaces over generic default layouts.
4. Use Tailwind CSS for responsive, mobile-first styling.
5. Use shadcn/ui for accessible foundational components.
6. Reference 21st.dev, Aceternity UI, Magic UI, and React Bits for distinctive components and visual effects.
7. Maintain visual consistency across headers, sidebars, navigation, cards, tables, forms, dialogs, and buttons.
8. Use appropriate whitespace, typography hierarchy, contrast, and visual grouping.
9. Provide polished loading skeletons, empty states, error states, success feedback, and confirmation dialogs.
10. Avoid excessive gradients, unnecessary glassmorphism, oversized headings, random colors, and decorative effects without a clear purpose.
11. Never sacrifice readability, accessibility, usability, or performance for visual effects.
12. Do not copy entire third-party websites. Adapt individual patterns to the application's requirements and design system.

### Animation standards

Use Motion for React when animation complexity justifies it. Its current package is motion, with React imports from motion/react.

`ash
npm install motion
`

Use animations for:
- Page entrance and exit transitions.
- Staggered lists and card entrances.
- Hover and tap feedback.
- Animated navigation indicators.
- Dialog and dropdown transitions.
- Expandable panels and accordions.
- Scroll-triggered content reveals.
- Number counters and progress indicators.
- Loading and success feedback.
- Layout changes and drag interactions when appropriate.

Prefer short, smooth, purposeful animations. Use CSS transitions for simple hover and focus effects instead of adding JavaScript animation unnecessarily.

Recommended defaults:
- Micro-interactions: approximately 120�220 ms.
- Standard UI transitions: approximately 180�300 ms.
- Larger entrance transitions: approximately 250�450 ms.
- Use spring animations selectively for natural motion.
- Avoid animating many unrelated elements simultaneously.
- Prefer transform and opacity animations for performance.
- Avoid unnecessary layout-triggering animations.
- Respect prefers-reduced-motion.
- Ensure all essential functionality works without animations.

### Implementation workflow

1. Identify the page purpose, target users, content hierarchy, and important actions.
2. Define the visual direction and reusable design tokens.
3. Review relevant design references for suitable patterns.
4. Select components compatible with React, TypeScript, Tailwind CSS, and the project's existing setup.
5. Inspect dependencies and licenses before integrating third-party source code.
6. Build responsive layouts and reusable components.
7. Implement animations with Motion or CSS as appropriate.
8. Integrate Redux Toolkit and API services without coupling business logic to presentation.
9. Verify keyboard navigation, screen-reader semantics, contrast, and reduced-motion behavior.
10. Run Jest tests, TypeScript checks, linting, and production builds.
11. Review the page at mobile, tablet, and desktop widths.
12. Refine spacing, typography, responsiveness, interaction states, and animation timing.

### Component integration rules

- Prefer existing project components over installing duplicates.
- Review third-party component code before adding it.
- Adapt copied components to the existing design tokens and coding conventions.
- Use TypeScript interfaces for component props.
- Keep animations reusable when the same pattern appears in multiple places.
- Avoid adding large animation dependencies for effects achievable with CSS.
- Do not add multiple component libraries without a clear architectural reason.
- Verify all external dependencies and their compatibility with the installed React and Tailwind versions.

### Definition of done

The interface must be visually consistent, responsive, accessible, functional, tested, and performant. Animations must improve user feedback or comprehension rather than distract from the task. Do not claim a visual or functional test passed unless it was actually performed.
