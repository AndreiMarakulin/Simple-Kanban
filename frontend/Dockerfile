FROM node:alpine
WORKDIR /usr/src/app
COPY ./package.json ./package.json
RUN npm i --legacy-peer-deps
COPY . .
RUN npm run build
