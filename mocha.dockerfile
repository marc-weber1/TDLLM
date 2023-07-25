FROM node:18-alpine

RUN apk add jq
RUN npm install -g mocha depcheck

WORKDIR /app
RUN npm init -y
RUN npm install axios

ENTRYPOINT cat > test.js && npm install $(depcheck --json | jq -r '.missing | keys | join(" ")') > /dev/null && mocha