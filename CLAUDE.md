# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## IMPORTANT: Documentation First

**Before generating any code, Claude Code MUST first read the relevant doc file(s) in the `/docs` directory.** Always check `/docs` for existing documentation, specifications, or guidelines that apply to the task at hand, and use that content to inform all code generation. Do not write code without consulting the relevant docs first.

- /docs/ui.md

## Commands

```bash
npm run dev      # Start development server at http://localhost:3000
npm run build    # Production build
npm run lint     # Run ESLint
npm run start    # Start production server (requires build first)
```

## Stack

- **Next.js 16** with App Router (`src/app/`)
- **React 19**
- **Tailwind CSS v4** (configured via `@import "tailwindcss"` in globals.css, PostCSS plugin in `postcss.config.mjs`)
- **TypeScript**
- **Geist** font family (loaded via `next/font/google`)

## Architecture

This is a fresh Next.js App Router project. The entry point is `src/app/page.tsx`. The root layout (`src/app/layout.tsx`) sets up fonts and wraps all pages in a flex column body.

CSS custom properties for `--background` and `--foreground` are defined in `globals.css` and exposed to Tailwind via `@theme inline`. Dark mode is handled via `prefers-color-scheme` media query.
