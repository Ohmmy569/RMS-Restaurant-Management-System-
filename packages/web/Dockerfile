FROM node:alpine

WORKDIR /app

ARG NEXT_PUBLIC_BASE_URL

ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL

COPY package.json .

COPY . .

RUN npm install -g pnpm

RUN pnpm install

RUN pnpm run build

EXPOSE 3000

CMD ["npm", "start"]
