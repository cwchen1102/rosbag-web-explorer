## Backend

**The backend is built using Django, a high-level Python web framework. It serves as the server-side component responsible for file storage, metadata retrieval, and API functionality.**

The primary files of backend are as follow:

- app
- backend
- requirements.txt
- uwsgi.ini

Below, we outline the primary files and their functionalites:

- uwsgi.ini
    
    uWSGI configuration is optimized for running a Python web application (likely a Django project) on port 8000. It employs multiple worker processes and threads for concurrency and performance, and it ensures proper cleanup with the **`vacuum`** setting
    
    ```python
    [uwsgi]
    socket = :8000
    module = backend.wsgi:application
    master = True
    processes = 4
    threads = 2
    vacuum = True
    ```
    
- backend
    - settings.py
    
    This file contains the Django project settings, including installed apps, database configurations, middleware, static and media file settings, and other important configurations.
    
    ```python
    INSTALLED_APPS = [
        'django.contrib.admin',
        'django.contrib.auth',
        'django.contrib.contenttypes',
        'django.contrib.sessions',
        'django.contrib.messages',
        'django.contrib.staticfiles',
        **'rest_framework',
        'corsheaders',
        'app',**
    ]
    ```
    
    ```python
    DATABASES = {
    "default": {
    'ENGINE': 'django.db.backends.postgresql_psycopg2',
    "NAME": os.environ.get('PGDATABASE'),
    "USER": os.environ.get('PGUSER'),
    "PASSWORD": os.environ.get('PGPASSWORD'),
    "HOST": os.environ.get('PGHOST'),
    "PORT": os.environ.get('PGPORT')
    }
    }
    ```
    
    ```python
    STATIC_ROOT = os.path.join(BASE_DIR, 'django_static')
    STATIC_URL = '/django_static/'
    ```
    
    ```python
    MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
    MEDIA_URL = '/media/'
    ```
    
    - urls.py
    
    This file defines the URL routing for the Django project. It includes the paths for the admin panel and includes the URLs defined in the `app.urls` module. Additionally, it serves media files during development.
    
    - wsgi.py
    
    This file is responsible for configuring the WSGI (Web Server Gateway Interface) application for the Django project. It sets up the WSGI callable application and is used to run the Django project with WSGI-compatible servers like Gunicorn or uWSGI.
    
- app
    - views.py
    
    The `views.py` file contains view functions that handle HTTP requests and return HTTP responses. It includes a `FileViewSet` class that utilizes Django Rest Framework for creating, retrieving, and managing files. It also has a custom action to retrieve metadata from Rosbag files.
    
    - urls.py
    
    This file defines the URL routing specific to the `app` Django app. It includes URL patterns for the API, allowing for operations related to files and Rosbag metadata retrieval.
    
    - serializers.py
    
    Serializers are used to convert complex data types (such as Django models) to native Python datatypes, making it easy to render data in a JSON format. In this file, the `FileSerializer` class specifies how to serialize and deserialize File model objects.
    
    - models.py
    
    This file defines the database model for the `File` object, which has a single field for file uploads. The  model is used to store information about the uploaded files.
    
    - metadata.py
    
    The `metadata.py` file contains a custom class, `MetaData`, that extracts metadata from Rosbag files. It uses the `rosbag` library to read Rosbag files and extract information such as filename, start time, end time, size, and details about topics within the Rosbag.