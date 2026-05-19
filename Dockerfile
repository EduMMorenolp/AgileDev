# Stage 1: Build frontend
FROM node:20-alpine AS builder
WORKDIR /build
COPY frontend/package.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine
RUN apk add --no-cache nginx && npm install -g opencode-ai
WORKDIR /workspace
COPY nginx.conf /etc/nginx/http.d/default.conf
COPY --from=builder /build/dist /srv/frontend
COPY opencode.json .
COPY .opencode .opencode
COPY templates templates
COPY proyectos proyectos
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh
EXPOSE 4097
CMD ["/bin/sh", "entrypoint.sh"]
