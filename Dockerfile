## Ref: http://www.clock.co.uk/blog/a-guide-on-how-to-cache-npm-install-with-docker
FROM node:6

RUN mkdir /root/tmp
RUN mkdir /root/content

## Set working directory to a tmp directory
WORKDIR /root/tmp

## Move package.json to tmp directory
COPY package.json /root/tmp/package.json

## Install npm dependencies then move into place
RUN npm install
RUN cp -rf node_modules /root/content
RUN cp package.json /root/content/package.json

## Set working directory to final content location
WORKDIR /root/content

## Copy the static contents and node server
COPY html /root/content/html
COPY src /root/content/src

## Run the babel build task
RUN npm run build

## Drop to bash shell and wait
CMD ["/bin/sh"]
