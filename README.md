# stakload

An AIO games library manager.

## Workspace Overview

This repository is organised as a `pnpm` workspace with two main areas:

- `apps/` contains runnable applications and services
- `packages/` contains shared contracts, infrastructure helpers, and tooling

Current apps:

- `apps/frontend` - the React renderer UI
- `apps/desktop` - the Electron shell and local desktop-side services
- `apps/api-webhook` - the NestJS service that receives IGDB webhooks and admin requests
- `apps/worker-builder` - the NestJS worker that builds aggregated game payloads and cache state

Current shared packages:

- `packages/contracts` - shared frontend/desktop contracts
- `packages/database` - TypeORM entities and database integration
- `packages/igdb-vendor` - IGDB resource definitions and vendor mapping support
- `packages/nestjs-logging` - shared NestJS logging module
- `packages/nestjs-redis` - shared Redis module for NestJS services
- `packages/eslint-config` - shared lint configuration

## Features

- Integrate all of the popular games libraries
- Install/uninstall games directly from the app
- Launch games directly from the app
- Create custom filters
- Launch fullscreen mode for console-like experience

## Architecture

- Frontend - [React](https://react.dev/) + [Vite](https://vite.dev/)
  - State is managed with [Zustand](https://zustand.docs.pmnd.rs/getting-started/introduction)
  - The renderer is served locally by Vite during development
- Desktop shell - [Electron](https://www.electronjs.org/)
  - Hosts the renderer and local desktop functionality
  - Built with `electron-vite`
- Backend services - [NestJS](https://nestjs.com/)
  - `api-webhook` persists IGDB webhook data into Postgres
  - `worker-builder` consumes queued jobs to build aggregated game payloads
- Infrastructure
  - Postgres for persisted backend data
  - Redis for queueing and cache-related coordination in local backend development

## Project Setup

### Prerequisites

- [pnpm](https://pnpm.io/installation)
- [Docker](https://docs.docker.com/get-docker/) with the Compose plugin
- [Tilt](https://docs.tilt.dev/install.html)

### Install

```bash
pnpm install
```

### Development

For the full local stack, development is orchestrated by **Tilt**. Tilt starts
the services in the right order, streams their logs in one dashboard, and
handles live-reloading for each layer of the stack.

```bash
tilt up
```

Open the Tilt UI at <http://localhost:10350> to see the status of every service.

If you only need the desktop app and frontend loop, there is also a lighter-weight root command:

```bash
pnpm dev
```

That starts the frontend dev server and then launches the Electron app once the renderer is ready.

#### What Tilt starts

| Label            | Service          | URL                     | Live-update mechanism                                      |
| ---------------- | ---------------- | ----------------------- | ---------------------------------------------------------- |
| `infrastructure` | Postgres 17      | `localhost:5432`        | Docker Compose (health-checked)                            |
| `infrastructure` | Redis 7          | `localhost:6379`        | Docker Compose (health-checked)                            |
| `backend`        | `api-webhook`    | <http://localhost:3001> | Docker rebuild + `restart_container` on src change         |
| `backend`        | `worker-builder` | —                       | Docker rebuild + `restart_container` on src change         |
| `frontend`       | React / Vite     | <http://localhost:5173> | Vite HMR (Tilt just owns the process)                      |
| `desktop`        | Electron         | —                       | electron-vite (starts after `frontend` and APIs are ready) |

#### Environment variables

Copy `.env.example` to `.env` and fill in the required values before running
`tilt up`. The Docker Compose services read variables from this file. The
defaults work for local development except for secrets.

Tilt watches `.env` automatically — saving the file triggers a re-evaluation
and restarts any containers whose configuration changed.

**Secrets**

| Variable              | Description                                           |
| --------------------- | ----------------------------------------------------- |
| `IGDB_CLIENT_ID`      | Twitch/IGDB OAuth client ID                           |
| `IGDB_CLIENT_SECRET`  | Twitch/IGDB OAuth client secret                       |
| `IGDB_WEBHOOK_SECRET` | Arbitrary secret used to verify IGDB webhook payloads |

**Ports** — these control the **host-side** port only. The internal container
port is fixed and never changes, so inter-service communication is unaffected.
Override them to avoid conflicts with other services already running on your machine:

| Variable           | Default | Container port | Service       |
| ------------------ | ------- | -------------- | ------------- |
| `POSTGRES_PORT`    | `5432`  | `5432`         | Postgres      |
| `REDIS_PORT`       | `6379`  | `6379`         | Redis         |
| `API_WEBHOOK_PORT` | `3001`  | `3001`         | `api-webhook` |

**Other**

| Variable                  | Default                 | Description                                      |
| ------------------------- | ----------------------- | ------------------------------------------------ |
| `PUBLIC_WEBHOOK_BASE_URL` | `http://localhost:3001` | Public URL for IGDB webhook callbacks            |
| `NODE_ENV`                | `development`           | Node environment                                 |
| `LOG_LEVEL`               | `info`                  | Log verbosity (`debug`, `info`, `warn`, `error`) |

#### Stopping

```bash
tilt down
```

Docker Compose volumes (Postgres data, Redis data) are preserved between sessions.

### Useful Commands

```bash
pnpm lint
pnpm typecheck
pnpm build:packages
pnpm build
task --list
```

### Workspace Changes

When adding a new workspace package:

```bash
pnpm install
```

Run it from the repository root after creating the package and declaring any
`workspace:*` dependencies so `pnpm-lock.yaml` and workspace links are updated
before package-local scripts import shared workspace packages.

When adding a new **NestJS backend service**, also add a `nestjs_service()` call
at the bottom of the `Tiltfile` and a corresponding entry in `docker-compose.yml`.

### More Documentation

- [`apps/api-webhook/README.md`](apps/api-webhook/README.md) - webhook service flow, handlers, resources, and admin endpoints
- [`scripts/README.md`](scripts/README.md) - repository utility scripts and Task-based helpers

### Build

```bash
# For Windows
pnpm run build:win

# For macOS
pnpm run build:mac

# For Linux
pnpm run build:linux
```

## TODO

- Features
  - Search for game metadata. Some games don't return a result, we should offer the ability to manually map a game
  - Data backup/sync. Not sure how useful installation data will be, but the rest should be backed up
  - HLTB. Look at [hltb-for-deck](https://github.com/hulkrelax/hltb-for-deck/blob/main/src/hooks/useHltb.ts) for inspiration
  - Fullscreen "Gaming" mode. Controller-friendly UI
    - Intro movie
  - Manual addition of games. Need to consider manually setting installation directory and other important fields etc.
  - Logo
  - System storage usage screen. Not sure how necessary this is, but could be a nice to have
  - Add launcher icons to homescreen. Potentially should be managed independently of configured integrations?
  - Configurability of default view (ie. desktop vs. "gaming")
  - Introduce last played timestamp functionality - currently this is just pulling quick launch games
  - Build home view when there are no games

- Chores
  - Fix tabler icons that were broken with latest update
  - Update grey styling across the board, should use CSS variables (with possibility of later theming)
  - Revisit game controls (launch/install/uninstall etc.)
  - Accessibility across entire app
  - If app crashes, window controls disappear (windows/linux). We should mitigate this
  - Fix bug with full window scrolling rather than just the main contents (behaviour seen on integrations page, but may happen everywhere)
  - Last sync timestamp
  - Look at dependency graph, anything we can kill?
  - Ensure that all strings are stored in i18n and there is no static text
  - Optimise app build
  - Migrate Epic games integration away from Legendary. Not sure this is necessary as we rely on the launcher for other libraries and it should be consistent
  - Filtering UI looks clunky, it needs to match the theme
  - "Save collection" modal needs to not look like crap
  - Break down GameDetailsView into components, maybe make into a view? Currently a mess
  - Refactor any components that are:
    - Using prop styling, move it to CSS Modules
    - Too big and should be broken down
  - Identify issue with BattleNetClientService not performing actions in launcher. Perhaps look at alternative methods
  - Update SystemService to work cross-platform
  - Update IncompatibilityIcon functionality so that it identifies platform support
  - Total refactor of integration settings view
  - Add option to re-sync/refresh metadata to context menu
  - Migrate sync notification (with updates) into notification panel
