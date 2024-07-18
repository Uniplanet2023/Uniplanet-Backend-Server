FROM node:22-alpine

# Create and change to the app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json ./


# Clean the cache to prevent issues
RUN npm cache clean --force

# Install dependencies using npm ci
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the app
CMD ["npm","start","--only=prod"]