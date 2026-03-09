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
# nestjs_service(name, shared_packages)
#
# Registers a NestJS app as a Tilt docker_build resource with
# live_update. Call once per service; adding a new service only
# requires a new call at the bottom of this section.
#
# Args:
#   name            - directory name under apps/ and the suffix
#                     of the Docker Compose image (stakload/<name>)
#   shared_packages - list of package names under packages/ whose
#                     src/ the service depends on at runtime
#
# Live-update flow (fastest possible inner loop):
#   pnpm-lock.yaml / pnpm-workspace.yaml change
#     → fall_back_on: full Docker image rebuild (dep tree changed)
#   package.json change (scripts / peer-deps / minor edits)
#     → sync manifest → pnpm install inside container
#   src / shared-package src change
#     → sync files → tsc rebuild → restart_container()
# ============================================================
def nestjs_service(name, shared_packages):
    pkg_src_paths = ['packages/%s/src' % p for p in shared_packages]

    # `only` limits both the Docker build context sent to the daemon
    # AND the set of paths Tilt watches for changes for this resource.
    only = [
        'package.json',
        'pnpm-lock.yaml',
        'pnpm-workspace.yaml',
        'tsconfig.json',
        'tsconfig.base.json',
        'apps/%s/src' % name,
        'apps/%s/package.json' % name,
        'apps/%s/tsconfig.json' % name,
    ] + pkg_src_paths

    # Rebuild each shared package then the app, using pnpm's
    # workspace-aware --dir flag so the commands run from /app.
    build_cmd = ' && '.join(
        ['pnpm --dir /app/packages/%s build' % p for p in shared_packages] +
        ['pnpm --dir /app/apps/%s build' % name]
    )

    docker_build(
        'stakload/%s' % name,
        context='.',
        dockerfile='docker/Dockerfile.nest.dev',
        build_args={'APP_NAME': name},
        only=only,
        live_update=[
            # Lock file or workspace manifest changed → full rebuild.
            # Running `pnpm install` in the container is not sufficient
            # when the resolved dep tree changes; a fresh image is needed.
            fall_back_on([
                'pnpm-lock.yaml',
                'pnpm-workspace.yaml',
            ]),

            # Sync the root and app-level package manifests so the
            # conditional install below sees the latest versions.
            sync('package.json', '/app/package.json'),
            sync('apps/%s/package.json' % name, '/app/apps/%s/package.json' % name),

            # Re-install dependencies only when package files changed.
            # pnpm-lock.yaml is covered by fall_back_on above, so
            # --frozen-lockfile is safe here (lockfile already matches).
            run(
                'pnpm install --frozen-lockfile',
                trigger=['package.json', 'apps/%s/package.json' % name],
            ),

            # Sync shared package sources then the app's own source.
        ] + [sync('packages/%s/src' % p, '/app/packages/%s/src' % p) for p in shared_packages] + [
            sync('apps/%s/src' % name, '/app/apps/%s/src' % name),

            # Rebuild shared packages in dependency order, then the app.
            # tsc is available in the dev image (devDeps are installed).
            run(build_cmd),

            # Restart the container's main process (PID 1 / node) without
            # tearing down and recreating the container.
            restart_container(),
        ],
    )

nestjs_service('api-webhook',    shared_packages=['database', 'igdb-vendor', 'nestjs-logging'])
nestjs_service('worker-builder', shared_packages=['database', 'nestjs-logging'])

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
