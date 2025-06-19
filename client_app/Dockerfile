# Stage 1: Build the app
FROM node:19.5.0-alpine AS build

WORKDIR /app

# Install build dependencies (if missing)
RUN apk add --no-cache bash

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application and build
COPY . .
RUN ls -alh /app
RUN npm run build

# Stage 2: Serve the built app with Nginx
FROM nginx:alpine

# Copy built assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Use default nginx entrypoint
CMD ["nginx", "-g", "daemon off;"]
