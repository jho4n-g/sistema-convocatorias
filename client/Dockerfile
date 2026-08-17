FROM node:22.18.0-alpine AS base 

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

##pnpm-lock.yaml
RUN corepack enable

FROM base AS development

##RUN pnpm install --frozen-lockfile

COPY . .

EXPOSE 5173

CMD ["pnpm", "run", "dev"]

FROM base AS builder 
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN pnpm install --frozen-lockfile
COPY  . .
RUN pnpm run build

FROM  nginx:alpine AS production

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html 

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


