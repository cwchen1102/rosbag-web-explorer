#!/bin/sh
# Make migrations
echo "Make migrations"
python manage.py makemigrations app
# Apply database migrations
echo "Apply database migrations"
python manage.py migrate
# Collect static files
echo "Collect static files"
python manage.py collectstatic --noinput

exec "$@"