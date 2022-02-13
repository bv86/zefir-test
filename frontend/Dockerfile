FROM node:16-alpine
ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "yarn.lock", "./"]

RUN yarn install 

COPY . .

RUN yarn build

# in docker-compose, server has hostname server

ENV SERVER_HOSTNAME = "server"

EXPOSE 3000

CMD [ "yarn", "start" ]