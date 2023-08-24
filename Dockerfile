# Use the official Node.js LTS (Long Term Support) image as the base image
FROM node:20-alpine3.17

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json (or yarn.lock) to the container
# This allows us to leverage Docker's caching mechanism for faster builds
COPY package*.json ./

# Install project dependencies
RUN npm install

# Seed Database
RUN npm run seed

# Copy the entire application directory into the container
COPY . .

# Expose the port on which your Node.js application is running (if applicable)
EXPOSE 3000

# Start the Node.js application
CMD ["npm", "start"]
