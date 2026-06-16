# Etape 1: Build Angular
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build -- --configuration production

# Etape 2: Serveur Nginx léger
FROM nginx:alpine

# Copie de la configuration nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copie des fichiers compilés depuis le builder
# "frontend" correspond au nom de l'application dans angular.json (dossier dist/frontend/browser)
COPY --from=builder /usr/src/app/dist/frontend/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
