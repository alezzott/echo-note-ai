FROM node:22-alpine

RUN apk update && apk upgrade --no-cache

WORKDIR /app

COPY package.json package-lock.json* ./
COPY tsconfig.json ./

RUN npm install
RUN apk add --no-cache ffmpeg

COPY . .

EXPOSE 4000

RUN mkdir -p uploads

CMD ["npx", "tsx", "watch", "src/index.ts"]