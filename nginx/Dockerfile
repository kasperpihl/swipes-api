FROM nginx

RUN rm /etc/nginx/conf.d/default.conf

COPY dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx
COPY swipes.conf /etc/nginx/sites-enabled/swipes.conf

EXPOSE 80