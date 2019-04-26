FROM node:10-jessie
RUN apt-get update && apt-get install -y povray
WORKDIR /app
COPY package.json .
RUN yarn install --prod
RUN mkdir /app/uploads
COPY index.js .
COPY dist ./dist
COPY stljs ./dist/stljs
USER node