# Use Node.js as the base image
FROM node:14

# Set working directory for backend
WORKDIR /app/backend

# Copy package files and install dependencies
COPY ./backend/package.json ./backend/package-lock.json ./
RUN npm install

# Copy the backend source code
COPY ./backend ./backend

# Expose the port the backend server runs on
EXPOSE 5000

# Start the backend server
CMD ["node", "server.js"]
