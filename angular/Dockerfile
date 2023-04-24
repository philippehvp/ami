FROM node:lts-alpine3.13

WORKDIR /src
COPY package*.json ./
RUN npm install
RUN npm install @ngxs/store @angular/material ngx-markdown --save

ENV PATH="./node_modules/.bin:$PATH"

COPY . ./
EXPOSE 4200