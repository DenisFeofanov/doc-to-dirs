FROM node:20-alpine

WORKDIR /app

COPY backend/package.json ./package.json
COPY backend/package-lock.json ./package-lock.json

RUN npm ci --omit=dev

COPY backend/src ./src

ENV NODE_ENV=production
ENV PORT=3000
ENV LOG_LEVEL=INFO

EXPOSE 3000

CMD ["npm", "start"]

