FROM node:alpine

WORKDIR /app

COPY package.json .

COPY . .

RUN npm install -g pnpm

RUN pnpm install

RUN pnpm run build

EXPOSE 3000

CMD ["npm", "run", "deploy"]
