FROM node:18-alpine
WORKDIR /app
RUN apk update && apk add --no-cache g++ 
RUN apk update && apk add --no-cache openjdk11
RUN apk update && apk add --no-cache python3 py3-pip

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 4000
CMD ["node","index.js"]