FROM debian

# Mise en place de l'environnement
RUN mkdir /var/www/server
ENV CONTAINER_HOME=/var/www/server
WORKDIR $CONTAINER_HOME

# Installation de nodejs && npm
RUN apt update && apt install -y node npm

# Met a l'heure le container
ENV TZ=Europe/Paris
RUN apt install tzdata
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Instal json-server dans l'environnement
RUN npm install -g json-server
COPY . .

RUN json-server --watch db.json --port 8000