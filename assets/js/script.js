const submitFormEl = document.getElementById('submit-form');
const submitTextEl = document.getElementById('search-text');
const cityNameEl = document.getElementById('current-city');
const tempEl = document.getElementById('temp')
const windEl = document.getElementById('wind')
const humidityEl = document.getElementById('humidity');
const uvEl = document.getElementById('uv-index');
const currentWeatherIconEl = document.getElementById('current-weather-icon')
const headerContainerEl = document.getElementById('h2-container');
const searchHistoryEl = document.getElementById('search-history');
// Base URL for weather API fetch
const apiUrl = 'https://api.openweathermap.org/data/2.5/onecall?appid=67cb8234fa480d50fdcf3a0cdfb94ffb&units=imperial';
// Base URL for converting city names into coordinates, add city name at the end for valid query
const geocodeUrl = 'http://api.openweathermap.org/geo/1.0/direct?appid=67cb8234fa480d50fdcf3a0cdfb94ffb&q=';

// Gets coordinates of a city given the city name
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

// Gets weather information for a city given the city coordinates
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
  console.log(data)
  console.log(name)
  const currentDate = getDate(parseInt(data.current.dt));
  updateCurrentWeather(data, name, currentDate);
  updateForecast(data);
  updateStorage(data, name)
  updateHistory();
}

// Updates 5-day forecast cards
const updateForecast = function(data) {

  // Checks if cards already exist
  if (document.getElementById('card-1') != null) {
    // Deletes them if so
    for (let i=0; i < 5; i++) {
      let toBeDeletedEl = document.getElementById(`card-${i+1}`);
      toBeDeletedEl.remove();
    }
  }

  // Create each day card
  for (let i=0; i < 5; i++) {
    let elId = i+1;
    createCard(elId, data);
  }

  return true;
}

// Creates a day of the 5 day forecast given the weather data and an element ID starting at 1 going through 5
const createCard = function(elId, data) {
  let cardEl = document.createElement('card');
  cardEl.id = `card-${elId}`;
  cardEl.className = 'day-card';

  // Create date header
  let headerEl = document.createElement('h4');
  let timestamp = data.daily[elId].dt
  headerEl.textContent = `${getDate(timestamp)}`
  cardEl.appendChild(headerEl);
  
  // Create weather icon
  let icon = data.daily[elId].weather[0].icon
  let iconUrl = `http://openweathermap.org/img/wn/${icon}.png`
  let imgEl = document.createElement('img');
  imgEl.className = 'forecast-icon';
  imgEl.src = iconUrl;
  cardEl.appendChild(imgEl);

  // Create temperature text
  let tempEl = document.createElement('p');
  // Averages minimum and max temperatures on particular day
  let temp = (parseInt(data.daily[elId].temp.max) + parseInt(data.daily[elId].temp.min)) / 2
  tempEl.textContent = `Temp: ${Math.round(temp)}\u00B0 F`
  cardEl.appendChild(tempEl);

  // Create wind text
  let windEl = document.createElement('p');
  let wind = data.daily[elId].wind_speed;
  windEl.textContent = `Wind: ${Math.round(wind)} MPH`;
  cardEl.appendChild(windEl);

  // Create humidity text
  let humidityEl = document.createElement('p');
  let humidity = data.daily[elId].humidity;
  humidityEl.textContent = `Humidity: ${humidity}%`;
  cardEl.appendChild(humidityEl);

  let containerEl = document.getElementById('five-day-container');
  containerEl.appendChild(cardEl);
}

// Updates weather info for current day
const updateCurrentWeather = function(data, name, currentDate) {

  // Update city name being displayed, extra spaces to separate icon
  cityNameEl.textContent = `${name} (${currentDate})   `;

  // API icon for current weather conditions
  let icon = data.current.weather[0].icon
  let iconUrl = `http://openweathermap.org/img/wn/${icon}.png`

  let imgTest = document.getElementById('current-weather-icon');
  // If image element already exists, delete it
  if (imgTest) {
    imgTest.remove();
  } 
  
  // create image displaying current weather status
  let imgEl = document.createElement('img');
  imgEl.className = 'weather-icon';
  imgEl.id = 'current-weather-icon'
  imgEl.src = iconUrl;
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

// Finds current date given timezone offset from UTC in seconds
const getCurrentDate = function(timezoneOffset) {

  // Date is in UTC time
  const today = new Date();
  // Local hour difference from UTC time, timezoneOffset is given in seconds
  const hourDisplacement = timezoneOffset / 60 / 60
  // Checks local date compared to UTC date
  let todayDate = undefined;
  if (today.getHours() + hourDisplacement < 0 ) {
    // If UTC timezone is a day ahead, subtract a day from the local calendar date
    todayDate = `${today.getMonth()+1}/${today.getDate()-1}/${today.getFullYear()}`;
  } else if (today.getHours() + hourDisplacement > 23) {
    // If UTC timezone is a day behind, add a day to the local calendar date
    todayDate = `${today.getMonth()+1}/${today.getDate()+1}/${today.getFullYear()}`;
  } else {
    // Else it's the same day
    todayDate = `${today.getMonth()+1}/${today.getDate()}/${today.getFullYear()}`;
  }
  return todayDate;
}

// Gives date in dd/mm/yyyy given a unix timestamp in seconds
const getDate = function(timestamp) {

  // new date expects milliseconds, so we multiply timestamp by 1000
  const date = new Date(timestamp * 1000);

  // date formatted in dd/mm/yyyy
  const formattedDate = `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`;

  return formattedDate;
}

// Updates recent history city search local storage
const updateStorage = function(data, name) {
  // Create city object to be stored locally
  let cityObj = {
    lat: data.lat,
    lon: data.lon,
    name: name
  }

  let savedCities = JSON.parse(localStorage.getItem('savedData'))

  // Check if saved data already exists
  if (!savedCities) {
    savedCities = [];
  }

  // Check if city is already in saved history
  for (let i=0; i < savedCities.length; i++) {
    // If city already exists, shift it to the beginning of the history
    if (savedCities[i].name === cityObj.name) {
      savedCities.splice(i, 1)
    }
  }

  // Add city to the front of the list
  savedCities.unshift(cityObj);

  // If list is over 8 objects in length, get rid of the last object
  if (savedCities.length >= 8) {
    savedCities.pop();
  }

  // Update local storage
  localStorage.setItem('savedData', JSON.stringify(savedCities))
  return true;
}

// Updates side bar containing search history
const updateHistory = function(data, name) {
  console.log(localStorage.getItem('savedData'));
  let savedCities = JSON.parse(localStorage.getItem('savedData'))

  let buttonContainer = document.getElementById('search-history');
  let containerChildrenCount = buttonContainer.childElementCount;
  console.log(containerChildrenCount)

  if (containerChildrenCount > 0) {
    // Remove previous buttons one by one
    for (let i=0; i < savedCities.length; i++) {
      let deleteMe = document.getElementById(`saved-city-${i+1}`)
      deleteMe.remove();
    }
  }

  // Add updated buttons
  if (savedCities) {
    for (let i=0; i < savedCities.length; i++) {
      let buttonEl = document.createElement('button');
      buttonEl.type = 'button';
      buttonEl.className = 'saved-cities';
      buttonEl.id = `saved-city-${i+1}`;
      buttonEl.textContent = savedCities[i].name;
  
      buttonContainer.appendChild(buttonEl);
    }
  }
  return true;
}

const clickHandler = function() {
  // checks what ID button had
  // loads lat, lon, and name from local storage
  // passes coordinates to getWeather function
}

submitFormEl.addEventListener('submit', generateCoordinates)

searchHistoryEl.addEventListener('click', clickHandler);

updateHistory();
