FROM ghcr.io/puppeteer/puppeteer:19.7.2

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

USER root

# Install fonts supporting Hindi and Punjabi
RUN apt-get update && apt-get install -y \
    fonts-indic \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci
COPY . .
CMD ["node", "index.js"]
