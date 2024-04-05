FROM node:14

WORKDIR /mongodb
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3000
ENTRYPOINT [ "node","index.js" ]
