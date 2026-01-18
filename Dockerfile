# Stage 1: Dependencies
FROM node:22-alpine AS deps

WORKDIR /app

# Install dependencies (including devDependencies needed for build)
COPY package.json package-lock.json ./
RUN npm ci && \
    npm cache clean --force

# Stage 2: Builder
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build arguments for environment variables (required during build)
ARG NEXT_PUBLIC_STRAPI_URL
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

ENV NEXT_PUBLIC_STRAPI_URL=${NEXT_PUBLIC_STRAPI_URL}
ENV NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=${NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}

# Build the application
# Note: next.config.js must have output: 'export'
RUN npm run build && \
    # Remove source files after build to reduce image size
    rm -rf src node_modules

# Stage 3: Production
FROM nginx:alpine AS runner

# Install dumb-init for proper signal handling and wget for health checks
RUN apk add --no-cache dumb-init wget

# Create non-root user for security
RUN addgroup -g 1001 -S nginx-app && \
    adduser -S -D -H -u 1001 -h /usr/share/nginx/html -s /sbin/nologin -G nginx-app -g nginx-app nginx-app

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static assets from builder stage
COPY --from=builder /app/out /usr/share/nginx/html

# Set proper ownership
RUN chown -R nginx-app:nginx-app /usr/share/nginx/html && \
    chown -R nginx-app:nginx-app /var/cache/nginx && \
    chown -R nginx-app:nginx-app /var/log/nginx && \
    chown -R nginx-app:nginx-app /etc/nginx/conf.d && \
    touch /run/nginx.pid && \
    chown -R nginx-app:nginx-app /run/nginx.pid

# Switch to non-root user
USER nginx-app

# Expose port 80 (standard HTTP, nginx listens on 3000 internally)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:3000/ || exit 1

# Start nginx with dumb-init
ENTRYPOINT ["dumb-init", "--"]
CMD ["nginx", "-g", "daemon off;"]
