# Use an official Node runtime as a parent image
FROM node:24

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Bundle app source inside Docker image
COPY . .

# Expose the port the app runs on
EXPOSE 5001

# Define environment variable
ENV NODE_ENV=production

# Run the app
CMD ["npm", "start"]