FROM alpine:latest

RUN apk update && apk add lighttpd

COPY . /var/www/localhost/htdocs/

EXPOSE 80

CMD ["lighttpd", "-D", "-f", "/etc/lighttpd/lighttpd.conf"]