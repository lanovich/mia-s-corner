FROM node:20-alpine AS base
WORKDIR /app
RUN npm install -g pnpm

FROM base AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml tsconfig.json ./
RUN pnpm install
COPY prisma ./prisma/
RUN pnpm prisma generate
COPY . .
RUN pnpm build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]