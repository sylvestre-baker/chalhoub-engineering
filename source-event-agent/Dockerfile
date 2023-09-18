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

# Use a development stage for development dependencies and compilation
FROM base as dev

# Install a specific version of typescript locally 
RUN npm install typescript@4.9.3

# Compile the TypeScript code
RUN npm run build
