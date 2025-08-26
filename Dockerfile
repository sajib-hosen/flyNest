#build stage
FROM node:18-alpine AS build

WORKDIR /usr/src/app

COPY package.json ./

COPY pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .

RUN pnpm build


#prod stage
FROM node:18-alpine

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist ./dist

COPY package.json ./

COPY pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install --only=production

RUN rm package.json

RUN rm pnpm-lock.yaml

EXPOSE 3000

CMD ["node", "dist/main.js"]