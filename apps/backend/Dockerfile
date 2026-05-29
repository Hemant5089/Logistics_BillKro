
# Build stage
FROM node:20 AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
RUN npm install

# Copy source code
COPY . .

# Provide a build-time DATABASE_URL so Prisma can validate schema during generate
ENV DATABASE_URL=postgresql://admin:admin@postgres:5432/logistics

# Generate Prisma client
RUN npm install @prisma/client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production stage
FROM node:20

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy built application from builder stage
COPY --from=builder /app/dist /app/dist

# Expose the port
EXPOSE 3001

# Start the application
CMD ["node","dist/src/main.js"]