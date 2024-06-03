// Define global scope variables
const apiKey = 'a719c6a51c50eef769c8fd900834b224';
const limit = 1;
const cnt = 40;
const units = 'imperial';
let lat = "";
let lon = "";
const cityEl = document.getElementById('city');
const searchButtonEl = document.querySelector('.search-btn');
const currentAndForecastWeatherContainerEl = document.getElementById('current-forecast-weather-container');
const searchHistoryContainerEl = document.getElementById('searchhistory-container');

// Function to get Geographical coordinates based on city
async function getGeoCoordinates(event) {
    let city = cityEl.value;
    if (city === "") {
        const targetEl = event.target;
        // Get city if function is invoked from search history button
        city = targetEl.getAttribute("data-keyword");
    }
    // Reset coordinates
    lat = "";
    lon = "";
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
        // Get geographical coordinates based on city
        const geoCodeAPIURL = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${limit}&appid=${apiKey}`;
        await fetch(geoCodeAPIURL)
            .then(function (response) {
                return response.json()
            })
            .then(function (data) {
                for (i = 0; i < data.length; i++) {
                    lat = data[i].lat;
                    lon = data[i].lon;
                }
                // Get current weather info
                getCurrentWeatherInfo(event, lat, lon);
                // Set search keyword to null
                cityEl.value = "";
            })
            .catch(function (error) {
                window.alert(error.message);
            })
    }
}
// Function to get current weather info
async function getCurrentWeatherInfo(event, lat, lon) {
    const currentWeatherInfoURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
    await fetch(currentWeatherInfoURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // Call function to display current weather information
            displayCurrentWeatherInfo(event, lat, lon, data);
        })
        .catch(function (error) {
            window.alert(error.message);
        })
}

function displayCurrentWeatherInfo(event, lat, lon, data) {
    // Get current weather information
    const currentTemperature = data.main.temp;
    const currentHumidity = data.main.humidity;
    const currentWeatherIcon = data.weather[0].icon;
    const currentWindSpeed = data.wind.speed;
    const cityName = data.name;
    const searchUnixTimestamp = data.dt;
    // convert timestamp to milliseconds and construct Date object
    let searchDate = new Date(searchUnixTimestamp * 1000);
    // returns date of a date object as a string using locale conventions
    searchDate = searchDate.toLocaleDateString('en-US');
    // Reset the HTML
    currentAndForecastWeatherContainerEl.innerHTML = "";
    // Build HTML to display current weather info
    const currentWeatherEl = document.createElement('div');
    currentWeatherEl.setAttribute("class", "weather-primarycard");
    const weatherIcon = document.createElement('img');
    weatherIcon.setAttribute("src",`https://openweathermap.org/img/wn/${currentWeatherIcon}.png`)
    currentWeatherEl.setAttribute("class", "weather-primarycard");
    const currentWeatherHeaderEl = document.createElement('h3');
    currentWeatherHeaderEl.textContent = `${cityName} (${searchDate})`;
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
    currentAndForecastWeatherContainerEl.appendChild(currentWeatherEl);
    // Call function to get weather forecast info
    getWeatherForecastInfo(event, lat, lon);
}

async function getWeatherForecastInfo(event, lat, lon) {
    const weatherForecastInfoURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}&cnt=${cnt}`;
    await fetch(weatherForecastInfoURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            return data.list;
        })
        .then(function (list) {
            // call function to display weather forecast info
            displayWeatherForecastInfo(event, list);
        })
        .catch(function (error) {
            window.alert(error.message);
        })
}

function displayWeatherForecastInfo(event, list) {
    const forecastHeaderEl = document.createElement('h2');
    forecastHeaderEl.textContent = '5-Day Forecast:'
    currentAndForecastWeatherContainerEl.appendChild(forecastHeaderEl);
    const weatherForecastEl = document.createElement('div');
    weatherForecastEl.setAttribute("class", "weather-forecast");
    for (let i = 0; i < list.length; i += 8) {
        const forecastUnixTimestamp = list[i].dt;
        let forecastDate =  new  Date(forecastUnixTimestamp*1000);
        forecastDate = forecastDate.toLocaleDateString('en-US');
        const forecastWeatherIcon = list[i].weather[0].icon;
        const forecastWeatherIconSrc = `https://openweathermap.org/img/wn/${forecastWeatherIcon}.png`
        const forecastTemperature = list[i].main.temp;
        const forecastWind = list[i].wind.speed;
        const forecastHumid = list[i].main.humidity;
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
        forecastHumidEl.textContent = `Humidity: ${forecastHumid}%`;
        weatherForecastCardBody.appendChild(forecastDateEl);
        weatherForecastCardBody.appendChild(forecastImgEl);
        weatherForecastCardBody.appendChild(forecastTempEl);
        weatherForecastCardBody.appendChild(forecastWindEl);
        weatherForecastCardBody.appendChild(forecastHumidEl);
        weatherForecastCard.appendChild(weatherForecastCardBody);
        weatherForecastEl.appendChild(weatherForecastCard);
        currentAndForecastWeatherContainerEl.appendChild(weatherForecastEl);
    }
    // Call function to display search history
    displaySearchKeyWords(event);
}

function displaySearchKeyWords(event) {
    // Get the target element from event
    const sourceTargetEl = event.target;
    if (sourceTargetEl.getAttribute("data-keyword") === null) {
        let searchKeyWordsArray = {};
        // Get the search keywords array from local storage to build search history
        searchKeyWordsArray = JSON.parse(localStorage.getItem("searchKeyWords"));
        if (searchKeyWordsArray) {
            const arrayLength = searchKeyWordsArray.length;
            const keyWord = searchKeyWordsArray[arrayLength - 1].keyWord;
            // Manipulate DOM to display search history
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
