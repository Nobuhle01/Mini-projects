async function getWeather() {
  const city = document.getElementById("cityInput").value;
  const apiKey = "8cb50308628f03c9c81532e8f67d5c1f";

  const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  const resultDiv = document.getElementById("weatherResult");
  const hourlyDiv = document.getElementById("hourlyForecast");
  const weeklyDiv = document.getElementById("weeklyForecast");

  resultDiv.innerHTML = "Fetching weather...";
  hourlyDiv.innerHTML = "";
  weeklyDiv.innerHTML = "";

  try {
    const [currentRes, forecastRes] = await Promise.all([
      fetch(currentUrl),
      fetch(forecastUrl),
    ]);

    if (!currentRes.ok || !forecastRes.ok) throw new Error("City not found");

    const currentData = await currentRes.json();
    const forecastData = await forecastRes.json();

    const temp = currentData.main.temp;
    const weather = currentData.weather[0].description;
    const icon = currentData.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    const timezoneOffset = currentData.timezone;
    const localTime = new Date(Date.now() + timezoneOffset * 1000)
      .toUTCString()
      .slice(17, 25);

    resultDiv.innerHTML = `
      <h2>${currentData.name}</h2>
      <p><strong>Local Time:</strong> ${localTime}</p>
      <p>Temperature: ${temp} °C</p>
      <p>Condition: ${weather}</p>
      <img src="${iconUrl}" alt="Weather icon" />
    `;

    // Background image
    const mainWeather = currentData.weather[0].main.toLowerCase();
    const bgMap = {
      clear: "clear.jpg",
      clouds: "clouds.jpg",
      rain: "rain.jpg",
      snow: "snow.jpg",
      thunderstorm: "thunderstorm.jpg",
      mist: "mist.jpg",
      haze: "mist.jpg",
      fog: "mist.jpg",
      drizzle: "rain.jpg",
    };
    const imageFile = bgMap[mainWeather] || "clear.jpg";
    document.body.style.backgroundImage = `url('images/${imageFile}')`;

    // Hourly Timeline (first 8 intervals = next 24 hours)
    hourlyDiv.innerHTML = `<h3>Today's Forecast:</h3><div class="timeline"></div>`;
    const timeline = hourlyDiv.querySelector(".timeline");

    forecastData.list.slice(0, 8).forEach(item => {
      const time = item.dt_txt.split(" ")[1].slice(0, 5);
      const icon = item.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${icon}.png`;
      const temp = item.main.temp;

      timeline.innerHTML += `
        <div class="timeline-item">
          <div>${time}</div>
          <img src="${iconUrl}" alt="" />
          <div>${temp}°C</div>
        </div>
      `;
    });

    // Weekly Forecast (filter one entry per day at 12:00)
    const dailyData = forecastData.list.filter(item =>
      item.dt_txt.includes("12:00:00")
    );

    weeklyDiv.innerHTML = `<h3>Weekly Forecast:</h3>`;
    dailyData.forEach(item => {
      const date = new Date(item.dt_txt).toDateString();
      const icon = item.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${icon}.png`;
      const temp = item.main.temp;
      const desc = item.weather[0].description;

      weeklyDiv.innerHTML += `
        <div style="margin: 10px 0;">
          <strong>${date}</strong><br/>
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
