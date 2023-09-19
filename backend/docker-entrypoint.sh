#!/bin/sh
# Function to wait for PostgreSQL to be ready
wait_for_postgres() {
    echo "Waiting for PostgreSQL to be ready..."
    until pg_isready -h postgres -p 5432 -q -U postgres; do
        sleep 1
    done
    echo "PostgreSQL is ready."
}
wait_for_postgres

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