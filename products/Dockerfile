FROM node:alpine

WORKDIR /app/src
COPY package.json .
RUN npm install --omit=dev
COPY . .

CMD ["npm","start","--only=prod"]
