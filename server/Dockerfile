FROM node:22.18.0-alpine AS base 

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN corepack enable


FROM base AS development

RUN pnpm install --frozen-lockfile

COPY . .


EXPOSE 3000

CMD [ "pnpm","run" ,"dev"]

FROM base AS production

RUN pnpm install --prod --frozen-lockfile

COPY . .

EXPOSE 3000

CMD [ "pnpm","run","start" ]