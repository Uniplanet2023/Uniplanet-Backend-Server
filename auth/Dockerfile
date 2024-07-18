FROM node:22-alpine

# Update npm to the latest version
RUN npm install -g npm@latest

# Clean the cache to prevent issues
RUN npm cache clean --force

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package.json .


# Install dependencies using npm ci
RUN npm install --legacy-peer-deps --omit=dev
RUN cat /root/.npm/_logs/*.log

# Copy the rest of the application
COPY . .

# Remove global TypeScript (optional but recommended)
RUN npm uninstall -g typescript

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the app
CMD ["npm","start","--only=prod"]