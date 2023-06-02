FROM node:18-alpine

RUN npm install -g mocha

CMD cat > test.js && mocha