FROM node:10 AS builder

WORKDIR /app

COPY . .

RUN yarn install && yarn build

FROM nginx:alpine


WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

RUN chmod 777 /var/cache/nginx

COPY --from=builder /app/build .

ENTRYPOINT ["nginx", "-g", "daemon off;"]

