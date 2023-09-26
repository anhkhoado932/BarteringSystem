FROM node

WORKDIR /barteringsystem

ENV NODE_ENV production

COPY . .

RUN npm install

EXPOSE 3000

CMD ["node", "server.js"]
