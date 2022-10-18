FROM node:16.18-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm install
RUN apk update && apk add --no-cache postgresql
CMD ["node", "index.js"]
