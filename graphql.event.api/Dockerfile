# Utilisez une étape de base pour les dépendances et le code
FROM node:16-buster as base

WORKDIR /usr/src/app

# Copiez les fichiers de dépendances
COPY package*.json ./

# Installez les dépendances
RUN npm ci

# Copiez le reste du code
COPY . .

EXPOSE 8001

# Utilisez une étape de développement pour les dépendances de développement et la compilation
FROM base as dev

# Installez pm2 et typescript localement (sauf si vous avez une raison spécifique de les avoir globalement)
RUN npm install pm2 typescript@4.9.3

# Compilez le code TypeScript
RUN npm run build