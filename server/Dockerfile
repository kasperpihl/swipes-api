#
# Nginx Dockerfile
#
# https://github.com/dockerfile/nginx
#

# Pull base image.
FROM node:6.9.5

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json .
# COPY package.json package-lock.json ./
RUN npm install --quiet

# Bundle app source
COPY . .

# Expose ports.
EXPOSE 5000

CMD ["npm","start"]

# Setting the user
# USER node