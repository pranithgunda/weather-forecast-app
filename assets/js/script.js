// Define global scope variables
const apiKey = 'a719c6a51c50eef769c8fd900834b224';
const cityEl = document.getElementById("city");
const searchButtonEl = document.querySelector(".btn");
const limit = 1;

// Function to get Geographical coordinates based on city
function getGeoCoordinates(event) {
    event.preventDefault();
    const city = cityEl.value;
    // Define coordinates
    let lat = "";
    let lon = "";
    if (city !== "") {
        const geoCodeAPIURL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${limit}&appid=${apiKey}`;
        fetch(geoCodeAPIURL)
            .then(function (response) {
                return response.json()
            })
            .then(function (data) {
                for (i = 0; i < data.length; i++) {
                    lat = data[i].lat;
                    lon = data[i].lon;
                }
                getCurrentWeatherInfo(lat, lon);
            })
            .catch(function (error) {
                console.log(error.message);
            })
    }
}
// Function to get current weather and forecast for 5 days
function getCurrentWeatherInfo(lat, lon) {
    const units = 'imperial';
    const currentWeatherInfoURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
    fetch(currentWeatherInfoURL)
    .then(function (response){
        return response.json();
    })
    .then(function (data){
        let currentWeatherInfo = data;
        displayCurrentWeatherInfo(currentWeatherInfo);
    })
    .catch(function (error){
        console.log(error.message);
    })
}

function displayCurrentWeatherInfo(data){
    // Get current weather information
    const currentTemperature = data.main.temp;
    const currentHumidity = data.main.humidity;
    const currentWeatherIcon = data.weather[0].icon;
    const currentWindSpeed = data.wind.speed;
    const cityName=data.name;
    const searchUnixTimestamp = data.dt;
    // convert timestamp to milliseconds and construct Date object
    const searchDate = new Date(searchUnixTimestamp*1000);
    // toISOString() method converts a Data Object into a string, using the ISO Standard and format is YYYY-MM-DDTHH:mm:ss:sssZ
    const searchDateString = searchDate.toISOString();
    const formattedSearchDate = searchDateString.substring(0,10);
    // Create div to display current weather information and append to forecast container
    const forecastContainerEl=document.getElementById('forecast-container');
    const currentWeatherEl =  document.createElement('div');
    const weatherIcon = document.createElement('img');
    weatherIcon.src = `https://openweathermap.org/img/wn/${currentWeatherIcon}.png`
    currentWeatherEl.setAttribute("class","weather-primarycard");
    currentWeatherEl.innerHTML = `<h3 id="header">${cityName} (${formattedSearchDate})</h3>
                                  <p>Temp: ${currentTemperature}°F</p>
                                  <p>Wind: ${currentWindSpeed} MPH</p>
                                  <p>Humidity:${currentHumidity}%</p>`
    forecastContainerEl.appendChild(currentWeatherEl);
    const currentWeatherHeaderEl = document.getElementById("header");
    currentWeatherHeaderEl.appendChild(weatherIcon);
}
searchButtonEl.addEventListener('click', getGeoCoordinates);
