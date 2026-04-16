# Use official Node.js runtime
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install ONLY production dependencies
RUN npm install --production

# Copy the rest of the backend code
COPY . .

# Expose backend port
EXPOSE 5000

# Define environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Start the application
CMD ["npm", "start"]