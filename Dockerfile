FROM node:8.1.2-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm install
RUN apk add --no-cache postgresql
CMD ["node", "index.js"]
