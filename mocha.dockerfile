FROM node:18-alpine

RUN npm install -g mocha

WORKDIR /app
RUN npm init -y
RUN npm install axios

CMD cat > test.js && mocha