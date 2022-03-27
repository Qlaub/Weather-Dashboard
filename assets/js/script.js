const submitFormEl = document.getElementById('submit-form');
const submitTextEl = document.getElementById('search-text');

// Base URL for weather API fetch
const apiUrl = 'https://api.openweathermap.org/data/2.5/onecall?appid=67cb8234fa480d50fdcf3a0cdfb94ffb';
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
  let updatedForecastUrl = `${apiUrl}&lat=${lat}&lon=${lon}`;

  fetch(updatedForecastUrl).then(function(response) {
    response.json().then(function(data) {
      console.log(data);
    })
  })
}

submitFormEl.addEventListener('submit', generateCoordinates)
