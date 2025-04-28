# Use the official Node.js image from Docker Hub
ARG NODE_VERSION=20.12.0
FROM node:${NODE_VERSION}-alpine


WORKDIR /app

COPY package*.json ./

RUN npm install 


COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
