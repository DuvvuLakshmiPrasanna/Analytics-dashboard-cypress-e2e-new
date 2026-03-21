FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache curl

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 3005

CMD ["npm", "run", "start"]
