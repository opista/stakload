FROM node:24-bookworm-slim AS builder

WORKDIR /workspace

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY tsconfig.json tsconfig.base.json ./
COPY packages ./packages
COPY apps/api-webhook ./apps/api-webhook

RUN pnpm install --frozen-lockfile --ignore-scripts
RUN pnpm --dir packages/database build
RUN pnpm --dir packages/igdb-vendor build
RUN pnpm --dir packages/nestjs-logging build
RUN pnpm --dir apps/api-webhook build

FROM node:22-bookworm-slim AS runner

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY --from=builder /workspace/node_modules ./node_modules
COPY --from=builder /workspace/packages/database ./packages/database
COPY --from=builder /workspace/packages/igdb-vendor ./packages/igdb-vendor
COPY --from=builder /workspace/packages/nestjs-logging ./packages/nestjs-logging
COPY --from=builder /workspace/apps/api-webhook ./apps/api-webhook

WORKDIR /app/apps/api-webhook

EXPOSE 3001

CMD ["node", "dist/src/main.js"]
