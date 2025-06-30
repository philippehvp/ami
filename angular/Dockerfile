FROM node:20

WORKDIR /src
COPY package*.json ./
RUN npm install -g npm@latest
RUN npm install
RUN npm install @ngxs/store @angular/material --save

ENV PATH="./node_modules/.bin:$PATH"

COPY . ./
EXPOSE 4200