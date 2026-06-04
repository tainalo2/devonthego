FROM node:24-alpine AS development
WORKDIR /app
RUN apk add --no-cache python3 make g++ git docker-cli
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3333
CMD ["npm", "run", "dev"]

FROM node:24-alpine AS builder
WORKDIR /app
RUN apk add --no-cache python3 make g++ git docker-cli
COPY package*.json ./
RUN npm ci
COPY . .
RUN node ace build

FROM node:24-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3333
RUN apk add --no-cache docker-cli git
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/adonisrc.ts ./adonisrc.ts
RUN mkdir -p /app/data
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
