# Fase 1: Build de la aplicación Vite/Vue
FROM node:22-alpine AS builder

WORKDIR /app

# Copiar dependencias primero para cachear la instalación
COPY package.json package-lock.json ./
RUN npm ci

# Copiar el resto del código y compilar
COPY . .
RUN npm run build

# Fase 2: Servir con nginx
FROM nginx:alpine

# Copiar configuración personalizada de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar artefactos de producción
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponer puerto 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
