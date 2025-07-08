const apiKey = "8cb50308628f03c9c81532e8f67d5c1f";

function formatTime(unix) {
  return new Date(unix * 1000).toLocaleTimeString("en-ZA", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Johannesburg"
  });
}

function formatDate(unix) {
  return new Date(unix * 1000).toLocaleDateString("en-ZA", {
    weekday: "long",
    month: "short",
    day: "numeric"
  });
}

function toggleWeekly() {
  const modal = document.getElementById("weeklyModal");
  modal.style.display = modal.style.display === "block" ? "none" : "block";
}

async function getWeather(cityInput = null) {
  const loader = document.getElementById("loader");
  const city = cityInput || document.getElementById("cityInput").value.trim();
  const resultDiv = document.getElementById("weatherResult");
  const hourlyDiv = document.getElementById("hourlyForecast");
  const weeklyDiv = document.getElementById("weeklyForecast");

  if (!city) {
    alert("⚠ Please enter a city name.");
    return;
  }

  loader.style.display = "block";
  resultDiv.innerHTML = "";
  hourlyDiv.innerHTML = "";
  weeklyDiv.innerHTML = "";

  try {
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    const [currentRes, forecastRes] = await Promise.all([
      fetch(currentUrl),
      fetch(forecastUrl)
    ]);

    if (!currentRes.ok || !forecastRes.ok)
      throw new Error("❌ Location not found. Try a different city.");

    const currentData = await currentRes.json();
    const forecastData = await forecastRes.json();

    displayCurrentWeather(currentData);
    displayHourlyForecast(forecastData);
    displayWeeklyForecast(forecastData);

  } catch (err) {
    resultDiv.innerHTML = `<p style="color:red;">${err.message}</p>`;
    document.body.style.backgroundImage = "none";
  } finally {
    loader.style.display = "none";
  }
}

function displayCurrentWeather(data) {
  const resultDiv = document.getElementById("weatherResult");
  const { temp, feels_like, humidity } = data.main;
  const { speed: windSpeed } = data.wind;
  const weather = data.weather[0].description;
  const icon = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  const localTime = new Date().toLocaleTimeString("en-ZA", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Johannesburg"
  });

  resultDiv.innerHTML = `
    <h2>${data.name}</h2>
    <p><strong>Local Time:</strong> ${localTime}</p>
   <p><i class="bi bi-thermometer-half"></i> Temp: ${temp}°C (Feels like: ${feels_like}°C)</p>
<p><i class="bi bi-cloud-sun"></i> Condition: ${weather}</p>
<p><i class="bi bi-droplet"></i> Humidity: ${humidity}%</p>
<p>
  <i class="bi bi-sunrise"></i> Sunrise: ${formatTime(data.sys.sunrise)} |
  <i class="bi bi-sunset"></i> Sunset: ${formatTime(data.sys.sunset)}
</p>

<p><i class="bi bi-wind"></i> Wind: ${windSpeed} m/s</p>

  `;

  const bgMap = {
    clear: "clear.jpg",
    clouds: "clouds.jpg",
    rain: "rainy.jpg",
    snow: "snow.jpg",
    thunderstorm: "thunderstorms.jpg",
    mist: "mist.jpg"
  };
  const mainWeather = data.weather[0].main.toLowerCase();
  const bgImage = bgMap[mainWeather] || "clear.jpg";
  document.body.style.backgroundImage = `url('images/${bgImage}')`;
}

function displayHourlyForecast(forecastData) {
  const hourlyDiv = document.getElementById("hourlyForecast");
  hourlyDiv.innerHTML = `<h3>⏱ Next 24h Forecast:</h3><div class="timeline"></div>`;
  const timeline = hourlyDiv.querySelector(".timeline");

  forecastData.list.slice(0, 8).forEach(item => {
    const time = item.dt_txt.split(" ")[1].slice(0, 5);
    const temp = item.main.temp;
    const icon = item.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}.png`;

    timeline.innerHTML += `
      <div class="timeline-item">
        <div>${time}</div>
        <img src="${iconUrl}" alt="icon" />
        <div>${temp}°C</div>
      </div>
    `;
  });
}

function displayWeeklyForecast(forecastData) {
  const weeklyDiv = document.getElementById("weeklyForecast");
  weeklyDiv.innerHTML = `<h3>📆 Weekly Forecast:</h3>`;
  const dailyData = forecastData.list.filter(f => f.dt_txt.includes("12:00:00"));

  dailyData.forEach(item => {
    const dateObj = new Date(item.dt_txt);
    const day = dateObj.toLocaleDateString("en-US", { weekday: "long" });
    const date = dateObj.toDateString();
    const icon = item.weather[0].icon;
    const temp = item.main.temp;
    const desc = item.weather[0].description;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}.png`;

    weeklyDiv.innerHTML += `
      <div class="weekly-item">
        <strong>${day}, ${date}</strong><br/>
        <img src="${iconUrl}" alt="" />
        <span>${temp}°C, ${desc}</span>
      </div>
    `;
  });
}

// Detect location on load
window.onload = function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`);
      const data = await res.json();
      getWeather(data.name);
    }, () => getWeather("Johannesburg"));
  } else {
    getWeather("Johannesburg");
  }
};

// Search on Enter
document.getElementById("cityInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") getWeather();
});
