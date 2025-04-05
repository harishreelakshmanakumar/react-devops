# Use Node.js as the base image
FROM node:14

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy backend source code
COPY . .

# Expose backend port
EXPOSE 5000

# Start backend server
CMD ["node", "server.js"]
