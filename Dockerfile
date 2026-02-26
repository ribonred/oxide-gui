# Use Bun as base
FROM oven/bun:1 AS base

# Set working directory
WORKDIR /app
COPY .output /app/.output

EXPOSE 3000

# Set environment variables
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production


# Start the application
CMD ["bun", ".output/server/index.mjs"]
