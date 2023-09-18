# Use a base stage for dependencies and code
FROM node:16-alpine as base

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 4000 for the application
EXPOSE 4000

# Use a development stage for development dependencies and compilation
FROM base as dev

# Install pm2 and a specific version of typescript locally 
RUN npm install pm2 typescript@4.9.3

# Compile the TypeScript code
RUN npm run build
