FROM node:latest

WORKDIR /src
COPY package*.json ./
RUN npm install -g npm@9.6.7
RUN npm install
RUN npm install @ngxs/store @angular/material --save
RUN npm install ngx-markdown --save

ENV PATH="./node_modules/.bin:$PATH"

COPY . ./
EXPOSE 4200