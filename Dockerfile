FROM ghcr.io/puppeteer/puppeteer:latest

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

USER root

# Install fonts supporting Hindi and Punjabi
# RUN apt-get install fonts-indic

WORKDIR /usr/src/app

COPY package*.json ./
# RUN npm ci
# RUN apt-get update
RUN apt-get install fonts-indic
RUN rm -rf /var/lib/apt/lists/*
RUN npm ci
COPY . .
CMD ["node", "index.js"]