FROM nginx:stable
MAINTAINER Jon Clerck <j.m.clerck@icloud.com>
WORKDIR /usr/share/nginx/html
COPY . .

