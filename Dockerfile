#
# Build the client
#
FROM oven/bun:1-alpine AS build

WORKDIR /build
COPY package.json ./
RUN bun install
COPY . .
RUN bun run vite-build

#
# Make final node_modules folder with only production dependencies
# (i.e. only the server dependencies)
#
FROM oven/bun:1-alpine AS deps
WORKDIR /build
COPY package.json ./
RUN bun install --production

#
# Production image with only the required files
#
FROM oven/bun:1-alpine

WORKDIR /app
COPY server.ts package.json /app/
COPY --from=deps /build/node_modules /app/node_modules
COPY --from=build /build/dist /app/dist

ENTRYPOINT []
CMD ["bun", "server.js"]
