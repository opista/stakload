# -*- mode: Python -*-
# Tiltfile — local development environment for stakload.
#
# Architecture:
#   - Infrastructure (Postgres, Redis): Docker Compose, health-checked.
#   - NestJS APIs (api-webhook, worker-builder): docker_build with live_update.
#   - React Frontend (frontend): local_resource, Vite HMR is the live-update.
#   - Electron Desktop (desktop): local_resource, electron-vite handles reloads.
#
# Prerequisites: tilt, docker, pnpm
# Start: tilt up

# ============================================================
# Docker Compose
#
# Declares all containerised services. API image names are
# matched to docker_build() calls below via the `image:` key
# added to each service. Postgres and Redis run exactly as
# defined in docker-compose.yml — no changes to their config.
# ============================================================
docker_compose('./docker-compose.yml')

# ============================================================
# NestJS API — api-webhook
#
# docker_build() overrides the compose `build:` section for
# this service because its image name matches
# `image: stakload/api-webhook` in docker-compose.yml.
#
# Live-update flow (fastest possible inner loop):
#   pnpm-lock.yaml / pnpm-workspace.yaml change
#     → fall_back_on: full Docker image rebuild (dep tree changed)
#   package.json change (scripts / peer-deps / minor edits)
#     → sync manifest → pnpm install inside container
#   src / shared-package src change
#     → sync files → tsc rebuild → restart_container()
# ============================================================
docker_build(
    'stakload/api-webhook',
    context='.',
    dockerfile='apps/api-webhook/Dockerfile.dev',
    # `only` limits both the Docker build context sent to the
    # daemon AND the set of paths Tilt watches for changes.
    # Anything outside this list is invisible to this resource.
    only=[
        'package.json',
        'pnpm-lock.yaml',
        'pnpm-workspace.yaml',
        'tsconfig.json',
        'tsconfig.base.json',
        'packages/database/src',
        'packages/igdb-vendor/src',
        'packages/nestjs-logging/src',
        'apps/api-webhook/src',
        'apps/api-webhook/package.json',
        'apps/api-webhook/tsconfig.json',
    ],
    live_update=[
        # Lock file or workspace manifest changed → full rebuild.
        # Running `pnpm install` in the container is not enough
        # when the resolved dep tree changes; we need a fresh image.
        fall_back_on([
            'pnpm-lock.yaml',
            'pnpm-workspace.yaml',
        ]),

        # Sync package manifests so the conditional install below
        # sees the latest versions before it runs.
        sync('package.json', '/app/package.json'),
        sync('apps/api-webhook/package.json', '/app/apps/api-webhook/package.json'),

        # Re-install dependencies only when package files changed.
        # pnpm-lock.yaml is covered by fall_back_on above, so
        # --frozen-lockfile is safe here (lockfile already matches).
        run(
            'pnpm install --frozen-lockfile',
            trigger=['package.json', 'apps/api-webhook/package.json'],
        ),

        # Sync shared package sources and the app's own source.
        sync('packages/database/src', '/app/packages/database/src'),
        sync('packages/igdb-vendor/src', '/app/packages/igdb-vendor/src'),
        sync('packages/nestjs-logging/src', '/app/packages/nestjs-logging/src'),
        sync('apps/api-webhook/src', '/app/apps/api-webhook/src'),

        # Rebuild shared packages in dependency order, then the app.
        # tsc is available in the dev image (devDeps are installed).
        run(
            'pnpm --dir /app/packages/database build'
            ' && pnpm --dir /app/packages/igdb-vendor build'
            ' && pnpm --dir /app/packages/nestjs-logging build'
            ' && pnpm --dir /app/apps/api-webhook build',
        ),

        # Restart the container's main process (PID 1 / node) without
        # tearing down and recreating the container.
        restart_container(),
    ],
)

# ============================================================
# NestJS Worker — worker-builder
# ============================================================
docker_build(
    'stakload/worker-builder',
    context='.',
    dockerfile='apps/worker-builder/Dockerfile.dev',
    only=[
        'package.json',
        'pnpm-lock.yaml',
        'pnpm-workspace.yaml',
        'tsconfig.json',
        'tsconfig.base.json',
        'packages/database/src',
        'packages/nestjs-logging/src',
        'apps/worker-builder/src',
        'apps/worker-builder/package.json',
        'apps/worker-builder/tsconfig.json',
    ],
    live_update=[
        fall_back_on([
            'pnpm-lock.yaml',
            'pnpm-workspace.yaml',
        ]),

        sync('package.json', '/app/package.json'),
        sync('apps/worker-builder/package.json', '/app/apps/worker-builder/package.json'),

        run(
            'pnpm install --frozen-lockfile',
            trigger=['package.json', 'apps/worker-builder/package.json'],
        ),

        sync('packages/database/src', '/app/packages/database/src'),
        sync('packages/nestjs-logging/src', '/app/packages/nestjs-logging/src'),
        sync('apps/worker-builder/src', '/app/apps/worker-builder/src'),

        run(
            'pnpm --dir /app/packages/database build'
            ' && pnpm --dir /app/packages/nestjs-logging build'
            ' && pnpm --dir /app/apps/worker-builder build',
        ),

        restart_container(),
    ],
)

# ============================================================
# Resource configuration & dependency ordering
#
# dc_resource() wraps a docker-compose service so we can:
#   - Assign it a label (groups services in the Tilt UI)
#   - Declare resource_deps (wait for health checks to pass)
#   - Attach clickable links to the Tilt UI card
#
# The health checks defined in docker-compose.yml (pg_isready,
# redis-cli ping) are what Tilt waits on — we don't duplicate
# them here, we just express the ordering.
# ============================================================
dc_resource('postgres', labels=['infrastructure'])
dc_resource('redis', labels=['infrastructure'])

dc_resource(
    'api-webhook',
    resource_deps=['postgres', 'redis'],
    labels=['backend'],
    links=['http://localhost:3001'],
)

dc_resource(
    'worker-builder',
    resource_deps=['redis'],
    labels=['backend'],
)

# ============================================================
# React Frontend — Vite dev server (local_resource)
#
# Vite's built-in HMR handles all browser live updates
# internally. Tilt's only job here is:
#   1. Start the process.
#   2. Stream its stdout/stderr into the Tilt dashboard.
#
# No Tilt live_update is needed or desired — adding one would
# create "double-watching" where Tilt and Vite both track the
# same files. Let Vite own this entirely.
# ============================================================
local_resource(
    'frontend',
    serve_cmd='pnpm --dir apps/frontend dev',
    labels=['frontend'],
    links=['http://localhost:5173'],
)

# ============================================================
# Electron Desktop App — electron-vite (local_resource)
#
# electron-vite's dev mode handles:
#   - Main process: watches src/main, rebuilds TypeScript,
#     and restarts Electron on change.
#   - Renderer: HMR via the `frontend` Vite dev server running
#     on localhost:5173 (loaded inside the BrowserWindow).
#   - Preload: rebuilt and injected automatically.
#
# Tilt's only job is: start the process, stream logs, and
# ensure the `frontend` Vite server and the APIs are up first
# so Electron doesn't open to a blank/error screen.
# ============================================================
local_resource(
    'desktop',
    serve_cmd='pnpm --dir apps/desktop dev',
    labels=['desktop'],
    resource_deps=['frontend', 'api-webhook', 'worker-builder'],
)
