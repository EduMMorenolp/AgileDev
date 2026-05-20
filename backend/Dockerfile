FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev && npm cache clean --force

COPY . .

EXPOSE 4098

CMD ["npx", "tsx", "src/index.ts"]
