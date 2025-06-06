const apiKey = "8cb50308628f03c9c81532e8f67d5c1f";

async function getWeather(cityInput = null) {
  const city = cityInput || document.getElementById("cityInput").value.trim();
  if (!city) return;

  const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  const resultDiv = document.getElementById("weatherResult");
  const hourlyDiv = document.getElementById("hourlyForecast");
  const weeklyDiv = document.getElementById("weeklyForecast");

  resultDiv.innerHTML = "<p>⏳ Fetching weather...</p>";
  hourlyDiv.innerHTML = "";
  weeklyDiv.innerHTML = "";

  try {
    const [currentRes, forecastRes] = await Promise.all([
      fetch(currentUrl),
      fetch(forecastUrl),
    ]);

    if (!currentRes.ok || !forecastRes.ok)
      throw new Error("City not found or API error.");

    const currentData = await currentRes.json();
    const forecastData = await forecastRes.json();

    const { temp, feels_like, humidity } = currentData.main;
    const { speed: windSpeed } = currentData.wind;
    const weather = currentData.weather[0].description;
    const icon = currentData.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    const timezoneOffset = currentData.timezone;

   const formatTime = unix =>
  new Date(unix * 1000).toLocaleTimeString("en-ZA", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Johannesburg"
  });

const localTime = new Date().toLocaleTimeString("en-ZA", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Africa/Johannesburg"
});


    resultDiv.innerHTML = `
      <h2>${currentData.name}</h2>
      <p><strong>Local Time:</strong> ${localTime}</p>
      <p>🌡 Temp: ${temp}°C (Feels like: ${feels_like}°C)</p>
      <p>🌤 Condition: ${weather}</p>
      <p>💧 Humidity: ${humidity}%</p>
      <p>🌬 Wind: ${windSpeed} m/s</p>
      <p>🌅 Sunrise: ${formatTime(currentData.sys.sunrise)} | 🌇 Sunset: ${formatTime(currentData.sys.sunset)}</p>
      <img src="${iconUrl}" alt="Weather icon" />
    `;

    // Background image update
    const bgMap = {
      clear: "clear.jpg",
      clouds: "clouds.jpg",
      rain: "rainy.jpg",
      snow: "snow.jpg",
      thunderstorm: "thunderstorms.jpg",
    };
    const mainWeather = currentData.weather[0].main.toLowerCase();
    const bgImage = bgMap[mainWeather] || "clear.jpg";
    document.body.style.backgroundImage = `url('images/${bgImage}')`;

    // Hourly forecast
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

    // Weekly forecast
    const dailyData = forecastData.list.filter(f =>
      f.dt_txt.includes("12:00:00")
    );

    weeklyDiv.innerHTML = `<h3>📆 Weekly Forecast:</h3>`;
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

  } catch (error) {
    resultDiv.innerHTML = `<p style="color:red;">${error.message}</p>`;
    document.body.style.backgroundImage = "none";
  }
}

function toggleWeekly() {
  const modal = document.getElementById("weeklyModal");
  modal.style.display = modal.style.display === "block" ? "none" : "block";
}

window.onclick = function (event) {
  const modal = document.getElementById("weeklyModal");
  if (event.target === modal) modal.style.display = "none";
};

window.onload = function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
      try {
        const res = await fetch(url);
        const data = await res.json();
        getWeather(data.name);
      } catch (err) {
        getWeather("South Africa");
      }
    }, () => getWeather("South Africa"));
  } else {
    getWeather("South Africa");
  }
};

// Optional: Search on Enter key
document.getElementById("cityInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") getWeather();
});
