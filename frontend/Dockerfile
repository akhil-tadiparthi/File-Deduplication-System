# syntax=docker/dockerfile:1

FROM node:13.12.0-alpine

ENV PATH /frontend/node_modules/.bin:$PATH

COPY package.json ./

COPY package-lock.json ./

RUN npm install --silent

COPY . ./

EXPOSE 3000

CMD [ "npm", "start"]