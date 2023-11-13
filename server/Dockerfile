FROM node:18.16

RUN apt update && apt install -y nano curl

# Mise en place de l'environnement
ENV CONTAINER_HOME=/var/www/
WORKDIR $CONTAINER_HOME

# Met a l'heure le container
ENV TZ=Europe/Paris
RUN apt install tzdata
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Instal json-server dans l'environnement
RUN mkdir server
RUN cd $CONTAINER_HOME/server && npm install -g json-server && npm i json-server
ADD ./ $CONTAINER_HOME/server

ENTRYPOINT ["json-server", "server/db.json", "--host", "0.0.0.0"]
