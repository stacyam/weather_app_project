const apiKey = "c335fo1b760e628d848413ebcaatbf0b";

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesady",
  "Thursday",
  "Friday",
  "Saturday",
];
function formatDate(timestamp) {
  let day = new Date(timestamp);
  let dayOfWeek = daysOfWeek[day.getDay()];

  let hours = day.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = day.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return (currentDay.innerHTML = `
   ${dayOfWeek} ${hours}:${minutes}
  `);
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

let currentDay = document.querySelector("#day");
let input = document.querySelector("input");
let form = document.querySelector("form");
let btnSearch = document.querySelector(".btns .btn-search");
let btnCurrent = document.querySelector(".btns .btn-current");
let descriptionElement = document.querySelector(".current #description");
let humidityElement = document.querySelector(".current #humidity");
let windElement = document.querySelector(".current #wind");
let iconElement = document.querySelector(".main-img #icon");
btnSearch.addEventListener("click", showNewCity);
btnCurrent.addEventListener("click", showCurrentCity);
let temperature = 18;
let names;

function showCurrentCity(evt) {
  evt.preventDefault();
  navigator.geolocation.getCurrentPosition(retrievePosition);
}

function getForecast(coordinates) {
  let units = "metric";
  let weatherUrl = `https://api.shecodes.io/weather/v1/forecast?lat=${coordinates.latitude}&lon=${coordinates.longitude}&key=${apiKey}&units=${units}`;
  axios.get(weatherUrl).then(displayForecast);
}

let h1 = document.querySelector("h1");
greetings();
function greetings() {
  names = prompt("Hello! What's your name?");
  if (names === null || names === "") {
    greetings();
  } else {
    showCity();
  }
}

function showCity() {
  h1.innerHTML = `<span>
  ${names},
  <br />
  Welcome to
  <br />
  <span id='currentCity'>Enter your <br /> city</span>
  <br />
  </span>
  <span id='temp'>
  18
  </span>
  <a href='#' id='celsius'>°C</a>
  / <a href='#' id='fahrenheit'>°F</a>
  `;
}

function getTemperature(response) {
  temperature = Math.round(response.data.temperature.current);
  convertToCelsium(temperature);
  let celsiumDegree = document.querySelector("#currentCity");
  celsiumDegree.innerHTML = temperature;
  currentCity.innerHTML = response.data.city;

  descriptionElement.innerHTML = response.data.condition.description;
  humidityElement.innerHTML = Math.round(response.data.temperature.humidity);
  windElement.innerHTML = Math.round(response.data.wind.speed);
  currentDay.innerHTML = formatDate(response.data.time * 1000);
  iconElement.setAttribute(
    "src",
    `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );
  iconElement.setAttribute("alt", response.data.condition.description);
  getForecast(response.data.coordinates);
}

function convertToCelsium() {
  let celsiumDegree = document.querySelector("#temp");
  celsiumDegree.innerHTML = temperature;
}

function convertToFahrenheit(event) {
  let fahrenheitDegree = document.querySelector("#temp");
  fahrenheitDegree.innerHTML = Math.round((temperature * 9) / 5 + 32);
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let days = ["Thu", "Fri", "Sat", "Sun"];
  let forecastHTML = "";
  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `
        <ul>
          <li>
            <p>
              ${formatDay(forecastDay.time)}
              <br />
              <span class="weather-forecast-tempearature-max">${Math.round(
                forecastDay.temperature.maximum
              )}°</span>
              <span class="weather-forecast-tempearature-min">${Math.round(
                forecastDay.temperature.minimum
              )}°</span>
            </p>
            <img class="w-100 weather-emojis" src="https://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
              forecastDay.condition.icon
            }.png" />
          </li>
        </ul>

  `;
    }
  });

  forecastHTML = forecastHTML;
  forecastElement.innerHTML = forecastHTML;
}

let temperatureCelsium = document.querySelector("#celsius");
temperatureCelsium.addEventListener("click", convertToCelsium);

let temperatureFahrenheit = document.querySelector("#fahrenheit");
temperatureFahrenheit.addEventListener("click", convertToFahrenheit);

function showNewCity(evt) {
  evt.preventDefault();
  if (input.value === "") {
    alert("Write a city please");
  } else {
    currentCity.innerHTML = `
  ${input.value}
  `;
    getWeatherByCity(input.value);
  }
}

function getWeatherByCity(city) {
  let weatherUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}`;
  axios.get(weatherUrl).then(getTemperature);
}

function retrievePosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let units = "metric";
  let weatherUrl = `https://api.shecodes.io/weather/v1/current?lon=${longitude}&lat=${latitude}&key=${apiKey}&units=${units}`;
  axios.get(weatherUrl).then(getTemperature);
}
