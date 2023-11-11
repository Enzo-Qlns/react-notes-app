FROM node:18.16

# Mise en place de l'environnement
ENV CONTAINER_HOME=/var/www/
WORKDIR $CONTAINER_HOME

# Met a l'heure le container
ENV TZ=Europe/Paris
RUN apt install tzdata
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Instal json-server dans l'environnement
RUN npm install -g json-server
RUN mkdir server
ADD ./ $CONTAINER_HOME/server
