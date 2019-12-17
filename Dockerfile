FROM node:latest

RUN mkdir -p /src/app

WORKDIR /src/app

COPY . /src/app

# ADD ./schema.sql /docker-entrypoint-initdb.d/

COPY wait-for-it.sh /wait-for-it.sh

RUN chmod +x /wait-for-it.sh

RUN npm install

EXPOSE 3002
