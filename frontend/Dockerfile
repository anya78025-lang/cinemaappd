FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY --from=builder /app/.next ./.next

# Copy public if it exists, otherwise create an empty one
RUN mkdir -p ./public

EXPOSE 3000

CMD ["npm", "start"]
