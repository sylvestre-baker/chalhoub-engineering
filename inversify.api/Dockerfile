FROM node:12-alpine as base

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Bundle app source
COPY . .

EXPOSE 8001

FROM base as dev
RUN npm install pm2 -g
RUN npm install typescript@4.1.3 -g
RUN npm install
RUN ls
RUN npm run tsc

CMD [ "pm2-runtinme", "dist/servers/inversify.client.api/index.js", "-i", "max"]