FROM debian

# Installation de nginx
RUN apt-get update && apt-get install -y nginx

# Met a l'heure le container
ENV TZ=Europe/Paris 
RUN apt install tzdata
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Ajoute les certificats ssl
RUN mkdir /etc/nginx/conf.d/ssl
COPY nginx/ssl/ /etc/nginx/conf.d/ssl/

# Ajoute les differents fichier de conf
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Ajoute le bulid
COPY client/build /usr/share/nginx/html

# Commande de lancement de nginx
ENTRYPOINT ["nginx", "-g", "daemon off;"]