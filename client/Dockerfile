FROM --platform=linux/amd64 node:20-alpine

# Create and change to the app directory
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package.json .

# Install dependencies using npm ci
RUN npm install --omit=dev

# Copy the rest of the application
COPY . .

RUN npm run build
# Expose the port the app runs on
EXPOSE 3005

# Define the command to run the app
CMD ["npm","start","--only=prod"]