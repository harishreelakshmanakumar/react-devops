# Use Node.js as base image
FROM node:14

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Install missing Material-UI dependency
RUN npm install @material-ui/core

# Copy source code
COPY . .

# Build React frontend
RUN npm run build

# Install a simple web server
RUN npm install -g serve

# Expose frontend port
EXPOSE 3000

# Serve the frontend
CMD ["serve", "-s", "build", "-l", "3000"]
