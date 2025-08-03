let chart; // To store the chart instance

async function getWeather() {
  const city = document.getElementById('city-input').value.trim();
  const apiKey = '4570d1ec08932121148271935c7cde06'; // Replace with your actual key
  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const [weatherRes, forecastRes] = await Promise.all([
      fetch(weatherURL),
      fetch(forecastURL)
    ]);

    const weatherData = await weatherRes.json();
    const forecastData = await forecastRes.json();

    if (weatherData.cod === 200 && forecastData.cod === "200") {
      // Display weather info
      const icon = weatherData.weather[0].icon;
      const result = `
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="weather icon" />
        <p><strong>${weatherData.name}, ${weatherData.sys.country}</strong></p>
        <p>${weatherData.weather[0].main} - ${weatherData.weather[0].description}</p>
        <p>🌡️ Temp: ${weatherData.main.temp}°C</p>
        <p>💧 Humidity: ${weatherData.main.humidity}%</p>
        <p>🌬️ Wind: ${weatherData.wind.speed} m/s</p>
      `;
      document.getElementById('weather-result').innerHTML = result;

      // Prepare data for chart
      const labels = forecastData.list.slice(0, 8).map(item =>
        item.dt_txt.split(' ')[1].slice(0, 5)
      );
      const temps = forecastData.list.slice(0, 8).map(item => item.main.temp);

      // Render or update chart
      renderChart(labels, temps);
    } else {
      document.getElementById('weather-result').innerHTML = `<p>❌ City not found.</p>`;
    }
  } catch (err) {
    document.getElementById('weather-result').innerHTML = `<p>⚠️ Error fetching data.</p>`;
  }
}

function renderChart(labels, temps) {
  const ctx = document.getElementById('weatherChart').getContext('2d');

  if (chart) chart.destroy(); // Clear old chart if exists

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Temp (°C)',
        data: temps,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderColor: '#ffffff',
        borderWidth: 2,
        pointBackgroundColor: '#fff',
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false,
          ticks: {
            color: '#fff'
          }
        },
        x: {
          ticks: {
            color: '#fff'
          }
        }
      },
      plugins: {
        legend: {
          labels: {
            color: '#fff'
          }
        }
      }
    }
  });
}
