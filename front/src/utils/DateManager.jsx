const DateManager =
{
    convertDate(date, forFront = true, withHour = true,forQuery = !forFront) {
        let tableauMois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
        let tableauJours = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

        let dateGlobale = new Date(date.toString());
        let annee = dateGlobale.getFullYear();
        let mois = dateGlobale.getMonth();
        let numeroMois = parseInt(dateGlobale.getUTCMonth()) + 1;
        let jour = dateGlobale.getDay();
        let numeroJour = dateGlobale.getDate();
        let heure = dateGlobale.getHours();
        let minute = dateGlobale.getMinutes();
        let seconde = dateGlobale.getSeconds();

        if (numeroMois < 10)
            numeroMois = "0" + numeroMois.toString();
        if (numeroJour < 10)
            numeroJour = "0" + numeroJour.toString();
        if (heure < 10)
            heure = "0" + heure.toString();
        if (minute < 10)
            minute = "0" + minute.toString();
        if (seconde < 10)
            seconde = "0" + seconde.toString();

        mois = tableauMois[mois];
        jour = tableauJours[jour];

        if (forFront) return (jour + ' ' + numeroJour + ' ' + mois + (withHour ? " à " + heure + ":" + minute + ":" + seconde : ""));
        if (forQuery) return annee + '-' + numeroMois + '-' + numeroJour;
    },
    removeDays(date, days) {
        let result = new Date(date);
        result.setDate(result.getDate() - days);
        return result;
    },
    addDays(date, days) {
        let result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    },
    getDateNow(version = 'EN') {
        let today = new Date();
        let year = today.getFullYear();
        let month = today.getMonth() + 1;
        let day = today.getDate();

        // ajoute un 0 devant le mois et le jour si leur valeur est inférieure à 10
        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;

        if (version === 'EN') return `${year}-${month}-${day}`;
        if (version === 'FR') return `${day}-${month}-${year}`;
    },
    getWeekDay(sundayIsEnd = true) {
        return sundayIsEnd ? ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"] : ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    },
    isNight(debutJour = 6, finJour = 18) {
        const heureActuelle = new Date().getHours();

        if (heureActuelle >= debutJour && heureActuelle < finJour) return false;  // C'est le jour
        else return true;  // C'est le soir
    },
};

export default DateManager; 