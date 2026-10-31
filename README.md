# YouTube Clone

An educational React and TypeScript app using Redux Toolkit, React Router, Vite,
Tailwind CSS, and Vitest. The root project is maintained independently of the
archived `react-youtube-clone-master/` directory, which is excluded from source
scanning, development file watching, type checking, and tests.

## Setup

Use Node.js 26 (pinned in `.nvmrc`) and npm 10 or newer. Supported alternatives
are Node 22.22.2+ and Node 24.15.0+ within their respective major versions.

```sh
nvm install
nvm use
npm ci
```

For a new checkout, copy `.env.example` to `.env.local` and set
`VITE_YOUTUBE_DATA_API_KEY` to your YouTube Data API v3 key. Existing
`REACT_APP_YOUTUBE_DATA_API_KEY` values remain supported, so the existing `.env`
file works without modification. The Vite variable takes precedence when both
are present. Restart the development server after changing environment files.

```sh
npm start
```

Open [localhost:3000](http://localhost:3000). `npm run dev` is an alias for the
same development server.

## Commands

| Command | Purpose |
| --- | --- |
| `npm start` / `npm run dev` | Start Vite with hot reload |
| `npm run typecheck` | Check application, test, and Vite configuration types |
| `npm test` | Run tests once |
| `npm run test:watch` | Watch and rerun tests |
| `npm run build` | Type check and create a production bundle in `build/` |
| `npm run preview` | Preview the production build locally |

Production hosting must serve `build/index.html` for client-side routes such
as `/search` and `/watch/:id`.

## Dependency migration

Dependencies were updated to the npm registry's stable releases on October 31,
2026. Create React App and its Jest tooling were replaced with Vite and Vitest.
React Router 8 uses imports from `react-router` in place of the retired
`react-router-dom` package. Tailwind 4 uses its Vite plugin and CSS import, so
the old PostCSS, Autoprefixer, and empty Tailwind configuration are unnecessary.
TypeScript uses bundler module resolution and strict null checking.

The existing home layout and placeholder search/watch pages are preserved.
Tests mock YouTube requests and do not require a live API key.
