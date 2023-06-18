FROM node:18-alpine

WORKDIR /app
RUN npm init -y
RUN npm install express

CMD node