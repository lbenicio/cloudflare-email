FROM node:18-slim

WORKDIR /app

# Install minimal packages
RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates git \
  && rm -rf /var/lib/apt/lists/*

# Copy package files first for layer caching
COPY package.json package-lock.json* ./

# Install dependencies (including dev deps that some scripts may need)
RUN npm install --no-audit --no-fund

# Install Wrangler CLI globally (needed for publish)
RUN npm install -g wrangler@^4

# Copy source
COPY . .

# Default entry: publish to Cloudflare (expects credentials via env or .env)
ENTRYPOINT ["wrangler"]
CMD ["publish", "--env", "production"]
