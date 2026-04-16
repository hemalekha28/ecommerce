# --- STAGE 1: Build (Using Debian-based Node) ---
FROM node:20 AS build

# Install system dependencies for canvas
RUN apt-get update && apt-get install -y \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg62-turbo-dev \
    libgif-dev \
    librsvg2-dev

WORKDIR /app
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Set build arguments for Vite
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
ARG VITE_RAZORPAY_KEY_ID
ENV VITE_RAZORPAY_KEY_ID=$VITE_RAZORPAY_KEY_ID

# Build the app
RUN npm run build

# --- STAGE 2: Production ---
FROM nginx:stable-alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
