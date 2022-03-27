const submitFormEl = document.getElementById('submit-form');
const submitTextEl = document.getElementById('search-text');
const cityNameEl = document.getElementById('current-city');
const tempEl = document.getElementById('temp')
const windEl = document.getElementById('wind')
const humidityEl = document.getElementById('humidity');
const uvEl = document.getElementById('uv-index');
const currentWeatherIconEl = document.getElementById('current-weather-icon')
const headerContainerEl = document.getElementById('h2-container');

// Base URL for weather API fetch
const apiUrl = 'https://api.openweathermap.org/data/2.5/onecall?appid=67cb8234fa480d50fdcf3a0cdfb94ffb&units=imperial';
// Base URL for converting city names into coordinates, add city name at the end for valid query
const geocodeUrl = 'http://api.openweathermap.org/geo/1.0/direct?appid=67cb8234fa480d50fdcf3a0cdfb94ffb&q=';

const generateCoordinates = function(event) {
  event.preventDefault();

  // Returns an alert if no city name has been entered
  if (!submitTextEl.value) {
    return alert('Please enter a city name');
  }
  let usaCountryCode = 'US';
  let cityName = submitTextEl.value.trim();
  let updatedGeocodeUrl = `${geocodeUrl}${cityName},${usaCountryCode}`;

  fetch(updatedGeocodeUrl).then(function(response) {
    response.json().then(function(data) {
      cityObj = data[0];
      getWeather(cityObj)
    })
  })
}

const getWeather = function(cityObj) {
  let lat = cityObj.lat;
  let lon = cityObj.lon;
  let name = cityObj.name;
  let updatedForecastUrl = `${apiUrl}&lat=${lat}&lon=${lon}`;

  fetch(updatedForecastUrl).then(function(response) {
    response.json().then(function(data) {
      infoHandler(data, name);
    })
  })
}

const infoHandler = function(data, name) {
  updateCurrentWeather(data, name);
  updateForecast(data);
}

const updateForecast = function(data) {
  // updates 5-day forecast cards
  console.log(data)
}

const updateCurrentWeather = function(data, name) {

  // Update city name being displayed, extra spaces to separate icon
  cityNameEl.textContent = `${name}    `;

  // API icon for current weather conditions
  let icon = data.current.weather[0].icon
  let iconUrl = `http://openweathermap.org/img/wn/${icon}.png`

  let imgEl = document.getElementsByClassName('weather-icon');
  // If image doesn't already exist, create the element with the appropriate class name and ID
  if (imgEl.length === 0) {
    imgEl = document.createElement('img');
    imgEl.className = 'weather-icon';
    imgEl.id = 'current-weather-icon'
  } 

  // Attach URL source to img element
  imgEl.src = iconUrl;
  // Display image
  headerContainerEl.appendChild(imgEl);

  // API gives us temperature in F
  let temp = data.current.temp;
  // Update element with temperature
  tempEl.textContent = `Temp: ${Math.round(temp)}\u00B0 F`;

  // API gives wind speed in MPH
  let wind = data.current.wind_speed;
  // Update element with wind speed
  windEl.textContent = `Wind: ${Math.round(wind)} MPH`;

  // API gives humidity in percentage
  let humidity = data.current.humidity;
  // Update element with humidity
  humidityEl.textContent = `Humidity: ${humidity}%`;

  let uvIndex = data.current.uvi;
  uvEl.textContent = uvIndex;

  // Update background color for UV based on UVI
  if (uvIndex <= 2 ) {
    uvEl.style.backgroundColor = '#8dc443';
  } else if (uvIndex <= 5) {
    uvEl.style.backgroundColor = '#ffbc01';
  } else if (uvIndex <= 7) {
    uvEl.style.backgroundColor = '#ffb301'
  } else if (uvIndex <= 10) {
    uvEl.style.backgroundColor = '#d1394a';
  } else {
    uvEl.style.backgroundColor = '#954f71';
  }

  return true;
}

submitFormEl.addEventListener('submit', generateCoordinates)
