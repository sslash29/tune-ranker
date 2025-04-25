ARG NODE_VERSION=20.12.0
FROM node:${NODE_VERSION}-alpine

# Create app user
RUN addgroup -g 1001 app && adduser -u 1001 -G app -s /bin/sh -D app

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies and set up required cache directory
RUN npm config set strict-ssl false && \
    npm install && \
    npm install --save-dev @babel/plugin-proposal-private-property-in-object && \
    mkdir -p node_modules/.cache && \
    chmod 777 node_modules/.cache

# Copy app files
COPY . .

# Set ownership of the app directory to the app user
RUN chown -R app:app /app

# Expose React development server port
EXPOSE 3000

# Switch to app user
USER app

# Start the React development server
CMD ["npm", "run","dev"]