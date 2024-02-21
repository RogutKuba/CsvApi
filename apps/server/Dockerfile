# Base stage
FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN curl -fsSL https://bun.sh/install | bash
RUN corepack enable

# Set working directory
FROM base AS builder
WORKDIR /app
RUN pnpm add -g turbo
COPY . .
RUN turbo prune @billing/server --docker

# # Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
WORKDIR /app
# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install

COPY --from=builder /app/out/full/ .
RUN pnpm turbo run build --filter=@billing/server

# Final stage
FROM oven/bun
COPY --from=installer /app /app
WORKDIR /app/apps/server
EXPOSE 8000
ENTRYPOINT [ "bun", "run", "src/index.ts" ]

