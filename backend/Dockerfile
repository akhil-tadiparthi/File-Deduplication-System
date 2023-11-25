# syntax=docker/dockerfile:1

FROM python:3.8-slim-buster

WORKDIR /backend

COPY requirements.txt /backend

RUN --mount=type=cache,target=/root/.cache/pip \
    pip3 install -r requirements.txt

COPY . /backend

EXPOSE 5000

CMD [ "python3", "server.py"]