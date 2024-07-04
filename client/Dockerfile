FROM node:alpine

WORKDIR /app
COPY package.json .
RUN npm install --omit=dev
COPY . .
RUN npm run build
EXPOSE 3005
CMD [ "npm", "run", "start" ]

