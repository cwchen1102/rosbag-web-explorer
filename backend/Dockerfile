FROM python:3.9.6
# Install the PostgreSQL client
RUN apt-get update && apt-get install -y postgresql-client
WORKDIR '/app'
COPY ./requirements.txt .
RUN pip install -r requirements.txt
COPY . .