# ==============================================================================
# Nexora Law Firm — Production Container
# Lightweight, high-performance static server powered by Nginx Alpine
# ==============================================================================
FROM nginx:1.27-alpine

# Set working directory
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy website files to nginx html root
COPY *.html ./
COPY vercel.json ./

# Copy nginx configuration
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Expose standard HTTP port
EXPOSE 80

# Healthcheck to verify the web server is responding
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
