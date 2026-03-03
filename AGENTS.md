# Repository Guidelines

## Project Structure & Module Organization
This project is a Next.js App Router application with TypeScript.

- `src/app`: app entry points, global layout, and page UI (`layout.tsx`, `page.tsx`, `globals.css`)
- `src/components`: feature components and reusable UI primitives (`src/components/ui`)
- `src/lib`: domain utilities, schema validation, and pure helper logic
- `src/stores`: Zustand state store and related tests
- `src/i18n`: locale messages and translation helpers
- `src/test`: shared Vitest setup (`setup.ts`)
- `public`: static assets

Keep business logic in `src/lib` or `src/stores`, and keep UI components focused on rendering and interactions.

## Build, Test, and Development Commands
Use `pnpm` for all package workflows.

- `pnpm dev`: run local development server
- `pnpm build`: create production build
- `pnpm start`: run production server from build output
- `pnpm lint`: run ESLint with Next.js + TypeScript config
- `pnpm test`: run Vitest once
- `pnpm test:watch`: run Vitest in watch mode

Example:
```bash
pnpm lint && pnpm test
```

## Coding Style & Naming Conventions
- Language: TypeScript (`strict` mode enabled)
- Indentation: 2 spaces
- Strings: prefer single quotes
- Semicolons: generally omitted in source files
- File names: kebab-case (e.g., `language-switcher.tsx`, `time-calc.ts`)
- Imports: use `@/*` alias for `src/*` paths when appropriate

Follow existing component patterns and keep changes consistent with nearby code.

## Testing Guidelines
- Framework: Vitest (`jsdom`, globals enabled) + Testing Library
- Setup file: `src/test/setup.ts`
- Test files: colocate with source as `*.test.ts` (or `*.test.tsx` for UI tests)
- Prefer deterministic unit tests for `src/lib` and store behavior in `src/stores`

Run `pnpm test` before opening a PR.

## Commit & Pull Request Guidelines
Current history uses concise, Conventional Commit-style messages (e.g., `feat(timetable): ...`).

- Recommended commit format: `type(scope): summary`
- Common types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`
- Write clear PR descriptions with:
  - what changed
  - why it changed
  - how it was tested (`pnpm lint`, `pnpm test`)
  - screenshots for UI-visible changes

Keep PRs focused and avoid mixing unrelated refactors with feature work.
