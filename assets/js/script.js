// Define global scope variables
const apiKey = 'a719c6a51c50eef769c8fd900834b224';
const cityEl = document.getElementById("city");
const searchButtonEl = document.getElementById("search-btn");
const limit = 1;
const cnt = 40;
const searchHistoryContainerEl = document.getElementById("searchhistory-container");
const units = 'imperial';
const forecastContainerEl = document.getElementById('forecast-container');

// Function to get Geographical coordinates based on city
function getGeoCoordinates(event) {
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
                // Get current weather info
                getCurrentWeatherInfo(lat, lon);
                // Get weather forecast info
                getWeatherForecastInfo(lat, lon);
                // Set search keyword to null
                cityEl.value = "";
                // Display search history
                displaySearchKeyWords(event);
            })
            .catch(function (error) {
                window.alert(error.message);
            })
    }
}
// Function to get current weather info
function getCurrentWeatherInfo(lat, lon) {
    const currentWeatherInfoURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
    fetch(currentWeatherInfoURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            displayCurrentWeatherInfo(data);
        })
        .catch(function (error) {
            window.alert(error.message);
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
    let formattedSearchDate = searchDateString.substring(0, 10);
    formattedSearchDate = formattedSearchDate.replaceAll("-", "/");
    // Reset the HTML
    forecastContainerEl.innerHTML = "";
    const currentWeatherEl = document.createElement('div');
    const weatherIcon = document.createElement('img');
    weatherIcon.src = `https://openweathermap.org/img/wn/${currentWeatherIcon}.png`
    currentWeatherEl.setAttribute("class", "weather-primarycard");
    const currentWeatherHeaderEl = document.createElement('h3');
    currentWeatherHeaderEl.textContent = `${cityName} (${formattedSearchDate})`;
    currentWeatherHeaderEl.appendChild(weatherIcon);
    const currentWeatherTempEl = document.createElement('p');
    currentWeatherTempEl.textContent = `Temp: ${currentTemperature}°F`;
    const currentWeatherWindEl = document.createElement('p');
    currentWeatherWindEl.textContent = `Wind: ${currentWindSpeed} MPH`;
    const currentWeatherHumidEl = document.createElement('p');
    currentWeatherHumidEl.textContent = `Humidity: ${currentHumidity}%`;
    currentWeatherEl.appendChild(currentWeatherHeaderEl);
    currentWeatherEl.appendChild(currentWeatherTempEl);
    currentWeatherEl.appendChild(currentWeatherWindEl);
    currentWeatherEl.appendChild(currentWeatherHumidEl);
    forecastContainerEl.appendChild(currentWeatherEl);
}

function getWeatherForecastInfo(lat, lon) {
    const weatherForecastInfoURL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}&cnt=${cnt}`;
    fetch(weatherForecastInfoURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            return data.list;
        })
        .then(function (list) {
            displayWeatherForecastInfo(list);
        })
        .catch(function (error) {
            window.alert(error.message);
        })
}

function displayWeatherForecastInfo(list) {
    const forecastHeaderEl = document.createElement('h2');
    forecastHeaderEl.textContent = '5-Day Forecast:'
    forecastContainerEl.appendChild(forecastHeaderEl);
    const weatherForecastEl = document.createElement('div');
    weatherForecastEl.setAttribute("class", "weather-forecast");
    for (let i = 0; i < list.length; i += 8) {
        const forecastDateString = list[i].dt_txt;
        let forecastDate = forecastDateString.substring(0, 10);
        forecastDate = forecastDate.replaceAll("-", '/');
        const forecastWeatherIcon = list[i].weather[0].icon;
        const forecastWeatherIconSrc = `https://openweathermap.org/img/wn/${forecastWeatherIcon}.png`
        const forecastTemperature = list[i].main.temp;
        const forecastWind = list[i].wind.speed;
        const forecastHumidity = list[i].main.humidity;
        // Manipulate DOM to display weather forecast information
        const weatherForecastCard = document.createElement('div');
        weatherForecastCard.setAttribute("class", "forecast-card");
        const weatherForecastCardBody = document.createElement('div');
        weatherForecastCardBody.setAttribute("class", "card-body");
        const forecastDateEl = document.createElement('h5');
        forecastDateEl.textContent = `${forecastDate}`;
        const forecastImgEl = document.createElement('img');
        forecastImgEl.setAttribute("src", forecastWeatherIconSrc);
        const forecastTempEl = document.createElement('p');
        forecastTempEl.textContent = `Temp: ${forecastTemperature}°F`;
        const forecastWindEl = document.createElement('p');
        forecastWindEl.textContent = `Wind: ${forecastWind} MPH`;
        const forecastHumidEl = document.createElement('p');
        forecastHumidEl.textContent = `Humidity: ${forecastHumidity}%`;
        weatherForecastCardBody.appendChild(forecastDateEl);
        weatherForecastCardBody.appendChild(forecastImgEl);
        weatherForecastCardBody.appendChild(forecastTempEl);
        weatherForecastCardBody.appendChild(forecastWindEl);
        weatherForecastCardBody.appendChild(forecastHumidEl);
        weatherForecastCard.appendChild(weatherForecastCardBody);
        weatherForecastEl.appendChild(weatherForecastCard);
        forecastContainerEl.appendChild(weatherForecastEl);
    }
}

function displaySearchKeyWords(event) {
    const sourceTargetEl = event.target;
    if (sourceTargetEl.getAttribute("data-keyword") === null) {
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
// Click event listener on search button
searchButtonEl.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    getGeoCoordinates(event);
});
// Delegate event listener to search history container
searchHistoryContainerEl.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    getGeoCoordinates(event);
});