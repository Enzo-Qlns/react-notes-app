const Utils = {
    isEmpty(...values) {
        if (values.length === 0)
            return true;
        for (let index = 0; index < values.length; index++) {
            const value = values[index];
            const isArray = Array.isArray(value);
            let bool = (undefined === value || "" === value || " " === value || null === value || (isArray && value.length === 0) || (typeof value === 'string' && value.length === 0));
            if (bool)
                return true;
        }
        return false;
    },
    objSize(obj, size = 0, key = undefined) {
        for (key in obj)
            if (obj.hasOwnProperty(key))
                size++;
        return size;
    },
    boolToValue(value) {
        return value ? 'OUI' : 'NON';
    },
    encodeBase64(value) {
        return btoa(value);
    },
    decodeBase64(value) {
        return atob(value);
    },
    capitalizeFirstLetter(word) {
        return word.charAt(0).toUpperCase() + word.slice(1)
    },
    isOnPhone() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
    waitBeforeReload(time = 1000) {
        return setTimeout(() => { window.location.reload() }, time);
    },
    async getUserInfo() {
        return new Promise(async (resolve, reject) => {
            const userInfo = {};

            // Obtenir le navigateur de l'utilisateur
            userInfo.browser = window.navigator.userAgent;

            // Obtenir l'adresse IP de l'utilisateur en utilisant un service tiers
            try {
                const response = await fetch('https://api.ipify.org?format=json');
                const data = await response.json();
                userInfo.ipAddress = data.ip;
            } catch (error) {
                console.error('Erreur lors de la récupération de l\'adresse IP :', error);
                reject();
            }

            // Obtenir la géolocalisation de l'utilisateur en utilisant l'API HTML5
            if ('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition((position) => {
                    userInfo.latitude = position.coords.latitude.toString();
                    userInfo.longitude = position.coords.longitude.toString();
                    resolve(userInfo);
                }, (error) => {
                    console.error('Erreur lors de la récupération de la géolocalisation :', error);
                    reject();
                });
            } else {
                console.error('La géolocalisation n\'est pas prise en charge par ce navigateur.');
                reject();
            }
        });
    }
};
export default Utils;