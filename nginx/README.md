## Nginx

Nginx is a powerful web server and proxy server that allows you to manage incoming web requests efficiently and safely. 

In this configuration [nginx/default.conf](https://github.com/cwchen1102/docker-django-react-nginx-uwsgi-postgres/blob/master/nginx/default.conf)

- Two upstream groups, `uwsgi` and `frontend`, each pointing to different backend servers.
- The `location` blocks specify how incoming requests are processed.
    - Requests to the root path **`/`** are proxied to the `frontend` server, making it suitable for serving the main website content.
    - Requests to **`/**django_static` and **`/**media` ****paths are used for serving static assets, such as stylesheets, JavaScript files, and media files, directly from the file system.
    - Requests to **`/**api` and **`/**admin` paths are proxied to the `uwsgi` group. This setup is for web applications where specific routes need to be handled by backend services.