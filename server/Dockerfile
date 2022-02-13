FROM node:16-alpine
ENV NODE_ENV=production

WORKDIR /server

COPY ["package.json", "yarn.lock", "./"]

RUN yarn install 

COPY . .

RUN yarn build

# in docker-compose, postgres has hostname db
ENV POSTGRES_HOST = "postgres"

EXPOSE 3001

CMD [ "yarn", "start" ]