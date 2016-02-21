FROM ubuntu:14.04
MAINTAINER Wiota Co

COPY . /opt/facade/

RUN apt-get update && apt-get install -y \
    build-essential \
    python-dev \
    python-pip \
    python-psycopg2 \
    lib32z1-dev \
    libxml2-dev \
    libxslt-dev \
    python-lxml


EXPOSE 80

WORKDIR /opt/facade

RUN pip install -r requirements.txt
