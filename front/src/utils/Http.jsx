import Utils from './Utils';
import Vars from "./Vars";
import { toast } from 'react-toastify';

const Http = {
    //  Génération des headers
    defaultHeaders() {
        const headers = new Headers();
        return headers;
    },
    //  Génération des options du call (méthode, body, headers...)
    defaultOptions(hasJson = true) {
        const options = {};
        options.method = "GET";
        options.headers = Http.defaultHeaders();
        hasJson && options.headers.append("Content-Type", "application/json");
        return options;
    },
    handleOups(err) {
        toast.error("Une erreur est survenue !");
    },
    //  Appel web generic
    async call(url = undefined, options = this.defaultOptions(), onResponse = undefined) {
        try {
            //  Lancement du call REST si tout les paramètres sont présents
            if (!Utils.isEmpty(url) && !Utils.isEmpty(onResponse)) {
                //  On retourne l'ensemble de la promesse
                return await fetch(url, options).then((response) => {
                    //  On récupére la réponse serveur => on formate en JSON, avec le code http reçu
                    response.json().then(data => {
                        onResponse(response.status, data, response.headers);
                    });
                });
            }
            else if (!Utils.isEmpty(url)) //  Autrement call classique sans la couche de JSON
                return await fetch(url, options);
        }
        catch (err) {
            this.handleOups(err);
        }
    },

    request_get_notes(onResponse = undefined) {
        const options = this.defaultOptions();
        return this.call(Vars.getHost() + '/notes/', options, onResponse);
    },

    request_get_specific_note(index, onResponse = undefined) {
        const options = this.defaultOptions();
        return this.call(Vars.getHost() + '/notes/' + index, options, onResponse);
    },

    request_add_note(title, content, updated, onResponse = undefined) {
        const options = this.defaultOptions();
        options.method = 'POST';
        options.body = JSON.stringify({ "title": title, "content": content, "pin": false, "checked": false, "updated": updated, "createdAt": new Date() });
        return this.call(Vars.getHost() + '/notes/', options, onResponse);
    },

    request_delete_note(index, onResponse = undefined) {
        const options = this.defaultOptions();
        options.method = 'DELETE';
        return this.call(Vars.getHost() + '/notes/' + index, options, onResponse);
    },

    request_update_note(index, title, content, pin, checked, updated, createdAt, onResponse = undefined) {
        const options = this.defaultOptions();
        options.method = 'PUT';
        options.body = JSON.stringify({ "title": title, "content": content, "pin": pin, "checked": checked, "updated": updated, "createdAt": createdAt });
        return this.call(Vars.getHost() + '/notes/' + index, options, onResponse);
    },

    request_get_profile(onResponse = undefined) {
        const options = this.defaultOptions();
        return this.call(Vars.getHost() + '/profile', options, onResponse);
    },

    request_get_weather(lat, long, onResponse = undefined) {
        const options = this.defaultOptions();
        return this.call("https://api.weatherapi.com/v1/current.json?key=" + Vars.getApiKeyWeather() + "&q=" + lat + "," + long, options, onResponse);
    },
};
export default Http;