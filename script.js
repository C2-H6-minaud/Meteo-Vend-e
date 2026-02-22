const API_KEY = 'af6291a95a09e4ca90d4baa55cbd1798'; 

const depts = {
    "01": "Ain", "02": "Aisne", "03": "Allier", "04": "Alpes-de-Haute-Provence", "05": "Hautes-Alpes", "06": "Alpes-Maritimes", "07": "Ardèche", "08": "Ardennes", "09": "Ariège", "10": "Aube", "11": "Aude", "12": "Aveyron", "13": "Bouches-du-Rhône", "14": "Calvados", "15": "Cantal", "16": "Charente", "17": "Charente-Maritime", "18": "Cher", "19": "Corrèze", "2A": "Corse-du-Sud", "2B": "Haute-Corse", "21": "Côte-d'Or", "22": "Côtes-d'Armor", "23": "Creuse", "24": "Dordogne", "25": "Doubs", "26": "Drôme", "27": "Eure", "28": "Eure-et-Loir", "29": "Finistère", "30": "Gard", "31": "Haute-Garonne", "32": "Gers", "33": "Gironde", "34": "Hérault", "35": "Ille-et-Vilaine", "36": "Indre", "37": "Indre-et-Loire", "38": "Isère", "39": "Jura", "40": "Landes", "41": "Loir-et-Cher", "42": "Loire", "43": "Haute-Loire", "44": "Loire-Atlantique", "45": "Loiret", "46": "Lot", "47": "Lot-et-Garonne", "48": "Lozère", "49": "Maine-et-Loire", "50": "Manche", "51": "Marne", "52": "Haute-Marne", "53": "Mayenne", "54": "Meurthe-et-Moselle", "55": "Meuse", "56": "Morbihan", "57": "Moselle", "58": "Nièvre", "59": "Nord", "60": "Oise", "61": "Orne", "62": "Pas-de-Calais", "63": "Puy-de-Dôme", "64": "Pyrénées-Atlantiques", "65": "Hautes-Pyrénées", "66": "Pyrénées-Orientales", "67": "Bas-Rhin", "68": "Haut-Rhin", "69": "Rhône", "70": "Haute-Saône", "71": "Saône-et-Loire", "72": "Sarthe", "73": "Savoie", "74": "Haute-Savoie", "75": "Paris", "76": "Seine-Maritime", "77": "Seine-et-Marne", "78": "Yvelines", "79": "Deux-Sèvres", "80": "Somme", "81": "Tarn", "82": "Tarn-et-Garonne", "83": "Var", "84": "Vaucluse", "85": "Vendée", "86": "Vienne", "87": "Haute-Vienne", "88": "Vosges", "89": "Yonne", "90": "Territoire de Belfort", "91": "Essonne", "92": "Hauts-de-Seine", "93": "Seine-Saint-Denis", "94": "Val-de-Marne", "95": "Val-d'Oise", "971": "Guadeloupe", "972": "Martinique", "973": "Guyane", "974": "La Réunion", "976": "Mayotte"
};

const lexiqueConditions = {
    'Clear': "Grand Soulail",
    'Rain': "Ça moulle dur",
    'Drizzle': "Ça fouine dehors",
    'Clouds': "Y'a point de soulail",
    'Thunderstorm': "Orage",
    'Snow': "Y'a du Fré et de la neige"
};

const threats = {
    'Clear': [
        "V'là le Soulail !",
        "O fét un biau temps !",
    ],
    'Rain': [
        "O moille, on va êt'tout guenés.",
    ],
    'Drizzle': [
        "O guenasse un p'tit peu.",
    ],
    'Thunderstorm': [
        "Le tounnâ s'en vient, o va touner !"
    ],
    'Snow': [
        "Quel Fré... Couvre-toi !"
    ],
    'Clouds': [
        "O s'abernzit, le temps est grisoux.",
    ]
};

const icons = { 'Clear': '☀️', 'Clouds': '☁️', 'Rain': '🌧️', 'Thunderstorm': '⛈️', 'Snow': '❄️', 'Mist': '🌫️', 'Drizzle': '🌦️' };

const selectedBox = document.getElementById('selected-item');
const optionsList = document.getElementById('options-list');

document.getElementById('date').innerText = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

function init() {
    for (let code in depts) {
        let div = document.createElement('div');
        div.innerText = `${code} - ${depts[code]}`;
        div.onclick = () => {
            selectedBox.querySelector('span').innerText = div.innerText;
            optionsList.classList.add('select-hide');
            fetchWeather(depts[code]);
        };
        optionsList.appendChild(div);
    }
    fetchWeather("Vendée"); // Lancement par défaut sur la Vendée
}

async function fetchWeather(city) {
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},FR&units=metric&lang=fr&appid=${API_KEY}`);
        const data = await res.json();
        const main = data.weather[0].main;

        // Si la température est basse (ex: < 5°C), on force le terme "Fré"
        const temp = Math.round(data.main.temp);
        const conditionText = temp < 5 ? `Y'a du Fré (${temp}°C)` : (lexiqueConditions[main] || data.weather[0].description);

        document.getElementById('temperature').innerText = `${temp}°C`;
        document.getElementById('condition').innerText = conditionText;
        document.getElementById('humidity').innerText = `${data.main.humidity}%`;
        document.getElementById('wind').innerText = `${Math.round(data.wind.speed * 3.6)} km/h`;
        document.getElementById('weather-icon').innerText = icons[main] || '🌡️';

        const sayings = threats[main] || ["Je te surveille, mon gâs."];
        document.getElementById('threat-text').innerText = sayings[Math.floor(Math.random() * sayings.length)];
    } catch (e) {
        document.getElementById('threat-text').innerText = "Erreur de connexion. Ta clé API met du temps à chauffer !";
    }
}

selectedBox.onclick = (e) => { e.stopPropagation(); optionsList.classList.toggle('select-hide'); };
document.onclick = () => { optionsList.classList.add('select-hide'); };

init();