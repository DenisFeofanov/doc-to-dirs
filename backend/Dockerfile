FROM node:22-alpine AS base
EXPOSE 3000
WORKDIR /app

COPY package*.json ./


FROM base AS dev
RUN npm i
COPY /src ./src
ENV NODE_ENV=development
CMD ["npm", "run", "start:dev"]

FROM base AS prod
RUN npm ci --omit=dev
COPY /src ./src
ENV NODE_ENV=production
CMD ["npm", "run", "start:prod"]



