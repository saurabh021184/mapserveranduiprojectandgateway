# Use an official Node.js runtime as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code
COPY ./src ./src
COPY ./resources ./resources

# Expose the desired port
EXPOSE 8001

# TODO Add health check

# Start the Node.js application
CMD [ "npm", "start" ]
