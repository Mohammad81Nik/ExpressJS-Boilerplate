FROM node:24-alpine AS builder

WORKDIR /app/backend

COPY package*.json .

COPY tsconfig.json .

RUN npm install

COPY . .

RUN npm run build

FROM node:24-alpine AS runner

WORKDIR /app/backend

COPY --from=builder /app/backend/node_modules node_modules
COPY --from=builder /app/backend/dist dist

ENV PORT=8000

EXPOSE 8000

CMD ["node", "dist/server.js"]