FROM node:0.10

## Install OS tools, ruby + compass
RUN apt-get update && apt-get -y install ruby-full
RUN gem update --system && gem install compass

## Install global npm tools
RUN npm install -g bower
RUN npm install -g grunt-cli

## Add CoDE npm registry
RUN npm config set registry https://npm.ncrcoe.com/

RUN mkdir /home/client

## Set working directory to project directory
WORKDIR /home/client

## Copy the rest of our assets into project directory
COPY bower.json /home/client
COPY Gruntfile.js /home/client
COPY karma.conf.js /home/client
COPY package.json /home/client
COPY app /home/client
COPY test /home/client

## Install npm dependencies
RUN npm install

## Start grunt server
CMD ["grunt", "serve"]
