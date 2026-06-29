FROM node:20-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json turbo.json ./
COPY packages ./packages
COPY apps ./apps
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app .
COPY . .
RUN npm run build:simulator

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/apps/simulator/.next/standalone ./
COPY --from=builder /app/apps/simulator/.next/static ./apps/simulator/.next/static
COPY --from=builder /app/public ./apps/simulator/public
EXPOSE 3000
CMD ["node", "apps/simulator/server.js"]
