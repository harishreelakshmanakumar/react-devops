# Use Node.js as the base image
FROM node:14

# Set working directory for backend
WORKDIR /app/Backend

# Copy package files and install dependencies
COPY ./Backend/package.json ./Backend/package-lock.json ./
RUN npm install

# Copy the backend source code
COPY ./Backend ./Backend

# Expose the port the backend server runs on
EXPOSE 5000

# Start the backend server
CMD ["node", "server.js"]
