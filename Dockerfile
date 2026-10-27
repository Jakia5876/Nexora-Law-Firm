# Nexora Law Firm — Root Dockerfile
# Delegates to the primary Next.js App Router application container
# Source of truth: "Next.js Project/Dockerfile"
FROM node:20-alpine AS base
WORKDIR /app
COPY "Next.js Project/package.json" "Next.js Project/package-lock.json*" ./
RUN npm ci
COPY "Next.js Project" ./
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
