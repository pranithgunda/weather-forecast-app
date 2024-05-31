// Define global scope variables
const apiKey = 'a719c6a51c50eef769c8fd900834b224';
const cityEl = document.getElementById("city");
const searchButtonEl = document.querySelector(".search-btn");
const limit = 1;
const searchHistoryContainerEl = document.getElementById("searchhistory-container");

// Function to get Geographical coordinates based on city
function getGeoCoordinates(event) {
    event.preventDefault();
    let city = cityEl.value;
    if (city === "") {
        const targetEl = event.target;
        city = targetEl.getAttribute("data-keyword");
    }
    // Define coordinates
    let lat = "";
    let lon = "";
    if (city !== "") {
        searchKeyWords = JSON.parse(localStorage.getItem("searchKeyWords"));
        if (searchKeyWords) {
            let searchKeyWord = { "keyWord": city };
            searchKeyWords.push(searchKeyWord);
            localStorage.setItem("searchKeyWords", JSON.stringify(searchKeyWords));
        } else {
            let searchKeyWords = [];
            let searchKeyWord = { "keyWord": city };
            searchKeyWords.push(searchKeyWord);
            localStorage.setItem("searchKeyWords", JSON.stringify(searchKeyWords));
        }
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
                getCurrentWeatherInfo(event,lat, lon);

            })
            .catch(function (error) {
                console.log(error.message);
            })
    }
}
// Function to get current weather and forecast for 5 days
function getCurrentWeatherInfo(event,lat,lon) {
    console.log(event.target);
    const units = 'imperial';
    const currentWeatherInfoURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
    fetch(currentWeatherInfoURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            let currentWeatherInfo = data;
            displayCurrentWeatherInfo(currentWeatherInfo);
            // set search keyword to null
            cityEl.value = "";
            displaySearchKeyWords(event);
        })
        .catch(function (error) {
            console.log(error.message);
        })
}

function displayCurrentWeatherInfo(data) {
    // Get current weather information
    const currentTemperature = data.main.temp;
    const currentHumidity = data.main.humidity;
    const currentWeatherIcon = data.weather[0].icon;
    const currentWindSpeed = data.wind.speed;
    const cityName = data.name;
    const searchUnixTimestamp = data.dt;
    // convert timestamp to milliseconds and construct Date object
    const searchDate = new Date(searchUnixTimestamp * 1000);
    // toISOString() method converts a Data Object into a string, using the ISO Standard and format is YYYY-MM-DDTHH:mm:ss:sssZ
    const searchDateString = searchDate.toISOString();
    const formattedSearchDate = searchDateString.substring(0, 10);
    // Create div to display current weather information and append to forecast container
    let forecastContainerEl = document.getElementById('forecast-container');
    // Reset the HTML
    forecastContainerEl.innerHTML = "";
    const currentWeatherEl = document.createElement('div');
    const weatherIcon = document.createElement('img');
    weatherIcon.src = `https://openweathermap.org/img/wn/${currentWeatherIcon}.png`
    currentWeatherEl.setAttribute("class", "weather-primarycard");
    currentWeatherEl.innerHTML = `<h3 id="header">${cityName} (${formattedSearchDate})</h3>
                                  <p>Temp: ${currentTemperature}°F</p>
                                  <p>Wind: ${currentWindSpeed} MPH</p>
                                  <p>Humidity:${currentHumidity}%</p>`
    forecastContainerEl.appendChild(currentWeatherEl);
    const currentWeatherHeaderEl = document.getElementById("header");
    currentWeatherHeaderEl.appendChild(weatherIcon);
}

function displaySearchKeyWords(event) {
    const sourceTargetEl = event.target;
    if(sourceTargetEl.getAttribute("data-keyword") === null){
        let searchKeyWordsArray = {};
        searchKeyWordsArray = JSON.parse(localStorage.getItem("searchKeyWords"));
        if (searchKeyWordsArray) {
            const arrayLength = searchKeyWordsArray.length;
            const keyWord = searchKeyWordsArray[arrayLength - 1].keyWord;
            const buttonEl = document.createElement('button');
            buttonEl.setAttribute("type", "button");
            buttonEl.setAttribute("class", "btn btn-secondary");
            buttonEl.setAttribute("data-keyword", keyWord);
            buttonEl.textContent = keyWord;
            searchHistoryContainerEl.appendChild(buttonEl);
        }
    }
}
searchButtonEl.addEventListener('click', getGeoCoordinates);
searchHistoryContainerEl.addEventListener('click', getGeoCoordinates);


