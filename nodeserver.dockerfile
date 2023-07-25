FROM node:18-alpine

RUN apk add jq
RUN npm install -g depcheck

WORKDIR /app
RUN npm init -y
RUN npm install express

ENTRYPOINT cat > server.js && npm install $(depcheck --json | jq -r '.missing | keys | join(" ")') > /dev/null && node server.js