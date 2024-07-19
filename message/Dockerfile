FROM --platform=linux/amd64 node:20-alpine

# Create and change to the app directory
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies using npm ci
RUN npm ci --legacy-peer-deps --omit=dev


# Copy the rest of the application
COPY . .

# Remove global TypeScript (optional but recommended)
RUN npm uninstall -g typescript

# Expose the port the app runs on
EXPOSE 3004

# Define the command to run the app
CMD ["npm","start","--only=prod"]