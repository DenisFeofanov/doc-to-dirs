FROM node:20-alpine AS base
EXPOSE 3000
WORKDIR /app

COPY /package.json ./package.json
COPY /package-lock.json ./package-lock.json

FROM base AS dev
RUN npm i
COPY /src ./src
ENV NODE_ENV=development
CMD ["npm", "start"]

FROM base AS prod
RUN npm ci --omit=dev
COPY /src ./src
ENV NODE_ENV=production
CMD ["npm", "start"]



