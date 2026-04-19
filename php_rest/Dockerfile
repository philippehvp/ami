FROM php:8.0-apache

WORKDIR /var/www/html
RUN docker-php-ext-install mysqli pdo pdo_mysql
RUN echo "ServerName ami-php" >> /etc/apache2/apache2.conf

COPY . ./

RUN service apache2 restart
EXPOSE 80

ENTRYPOINT ["/usr/sbin/apache2ctl", "-D", "FOREGROUND"]