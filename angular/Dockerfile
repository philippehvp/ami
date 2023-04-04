FROM node:lts-alpine3.13

WORKDIR /src
COPY package*.json ./
RUN npm install
RUN npm install @ngxs/store @auth0/auth0-angular @angular/material --save

ENV PATH="./node_modules/.bin:$PATH"

COPY . ./
EXPOSE 4200