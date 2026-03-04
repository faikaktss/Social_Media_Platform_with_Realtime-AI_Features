FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./

RUN npm ci --only=production

COPY backend/prisma ./prisma/
RUN npx prisma generate

COPY backend/src ./src
COPY backend/server.js ./server.js

RUN mkdir -p uploads

EXPOSE 3000

CMD ["node", "server.js"]
