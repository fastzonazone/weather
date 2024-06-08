document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = 'b4ed266f3b97324c22cb609bc503243d'; // Inserisci qui la tua chiave API

    // Funzione per ottenere la posizione attuale dell'utente
    function getPosition() {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            } else {
                reject('Geolocalizzazione non supportata.');
            }
        });
    }

    // Funzione per ottenere i dati meteo
    async function getWeather(lat, lon) {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=it`);
            if (!response.ok) throw new Error('Errore nella richiesta meteo');
            return await response.json();
        } catch (error) {
            console.error('Errore nel recupero dei dati meteo:', error);
            throw error;
        }
    }

    // Funzione per determinare se è il momento giusto per lavare la macchina
    function canWash(weather) {
        const weatherId = weather.weather[0].id;
        return weatherId < 200 || (weatherId >= 600 && weatherId < 700);
    }

    // Funzione principale
    async function init() {
        try {
            const position = await getPosition();
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const weather = await getWeather(lat, lon);

            const resultElement = document.getElementById('result');
            const emojiElement = document.getElementById('emoji');
            const descriptionElement = document.getElementById('description');
            const temperatureElement = document.getElementById('temperature');

            if (canWash(weather)) {
                resultElement.textContent = "Sì, puoi lavare la tua macchina!";
                emojiElement.textContent = "😊";
                emojiElement.classList.add('yes', 'bounce');
            } else {
                resultElement.textContent = "No, meglio non lavare la tua macchina.";
                emojiElement.textContent = "😞";
                emojiElement.classList.add('no', 'bounce');
            }

            // Mostra dettagli meteo
            descriptionElement.textContent = `Condizioni meteo: ${weather.weather[0].description}`;
            temperatureElement.textContent = `Temperatura: ${weather.main.temp}°C`;

        } catch (error) {
            document.getElementById('result').textContent = "Impossibile ottenere le informazioni meteo.";
            document.getElementById('emoji').textContent = "😕";
            document.getElementById('description').textContent = error.message;
            document.getElementById('temperature').textContent = '';
        }
    }

    init();
});
