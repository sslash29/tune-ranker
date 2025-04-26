ARG NODE_VERSION=20.12.0
FROM node:${NODE_VERSION}-alpine

# Install git
RUN apk add --no-cache git

# Create app user
RUN addgroup -g 1001 app && adduser -u 1001 -G app -s /bin/sh -D app

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm config set strict-ssl false && \
    npm install && \
    npm install --save-dev @babel/plugin-proposal-private-property-in-object && \
    npm install react-router-dom --save && \
    mkdir -p node_modules/.cache && \
    chmod 777 node_modules/.cache

# Copy app files and set ownership directly
COPY --chown=app:app . .

# Expose port
EXPOSE 5173

# Switch to app user
USER app

# Start
CMD ["npm", "run", "dev"]
