// Live clock
function updateClock() {
    const now = new Date();
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    document.getElementById('clock').textContent = `${h}:${m}`;
}
updateClock();
setInterval(updateClock, 10000);

// Seattle weather via Open-Meteo (free, no API key)
const WX_CODES = {
    0:  ['☀️', 'Clear'],
    1:  ['🌤️', 'Mostly Clear'],
    2:  ['⛅', 'Partly Cloudy'],
    3:  ['☁️', 'Overcast'],
    45: ['🌫️', 'Foggy'],   48: ['🌫️', 'Foggy'],
    51: ['🌦️', 'Drizzle'], 53: ['🌦️', 'Drizzle'], 55: ['🌦️', 'Drizzle'],
    61: ['🌧️', 'Rain'],    63: ['🌧️', 'Rain'],    65: ['🌧️', 'Heavy Rain'],
    71: ['🌨️', 'Snow'],    73: ['🌨️', 'Snow'],    75: ['❄️', 'Heavy Snow'],
    77: ['🌨️', 'Snow Grains'],
    80: ['🌦️', 'Showers'], 81: ['🌦️', 'Showers'], 82: ['⛈️', 'Heavy Showers'],
    85: ['🌨️', 'Snow Showers'], 86: ['🌨️', 'Snow Showers'],
    95: ['⛈️', 'Thunderstorm'], 96: ['⛈️', 'Thunderstorm'], 99: ['⛈️', 'Thunderstorm'],
};

async function fetchWeather() {
    try {
        const res = await fetch(
            'https://api.open-meteo.com/v1/forecast' +
            '?latitude=47.6062&longitude=-122.3321' +
            '&current=temperature_2m,weather_code' +
            '&temperature_unit=fahrenheit'
        );
        const data = await res.json();
        const temp = Math.round(data.current.temperature_2m);
        const code = data.current.weather_code;
        const [emoji, label] = WX_CODES[code] ?? ['🌡️', 'Seattle'];
        const el = document.getElementById('weather');
        el.textContent = `${emoji} ${temp}°F`;
        el.title = `Seattle — ${label}`;
    } catch (_) {
        // API unreachable — leave the fallback text
    }
}
fetchWeather();
setInterval(fetchWeather, 20 * 60 * 1000); // refresh every 20 min

// iOS-style tap ripple on tiles
document.querySelectorAll('.tile:not(.tile-placeholder)').forEach(tile => {
    tile.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255,255,255,0.18);
            transform: scale(0);
            animation: ripple 0.5s ease-out forwards;
            pointer-events: none;
            width: 120px; height: 120px;
            left: ${e.offsetX - 60}px;
            top: ${e.offsetY - 60}px;
        `;
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 520);
    });
});

// Inject ripple keyframes once
const style = document.createElement('style');
style.textContent = `@keyframes ripple { to { transform: scale(2.5); opacity: 0; } }`;
document.head.appendChild(style);
