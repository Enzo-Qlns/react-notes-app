#!/bin/bash

docker-compose down && docker rmi --force nginx-react-note-app:latest server-react-note-app:latest
docker-compose up -d
