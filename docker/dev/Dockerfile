FROM node:24

WORKDIR /usr/src/app

RUN npm install -g bun

COPY package.json ./

COPY package-lock.json ./

RUN npm install

COPY . .

EXPOSE  5501

CMD [ "npm", "run", "dev" ]