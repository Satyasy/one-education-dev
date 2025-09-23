# Stage 1 - Build
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

CMD [ "npm", "run", "dev", "--", "--host", "0.0.0.0" , "--port", "80" ]