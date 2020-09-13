var cityInputEl = document.getElementById("city-input");
var apiKey = "b0c7f7890fd4b66f3bf5aff8377ec0db";

function getWeatherCoords() {
  var city = cityInputEl.value;
  var apiUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey;

  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        // OpenWeather's One Call API has all the data we need but doesn't accept city names
        // Use lat/lon from first call to get all needed data
        getWeather(data.name, data.coord.lat, data.coord.lon);
      });
    } else {
      alert("Error: " + response.statusText);
    }

  }).catch(function (error) {
    alert("Unable to connect to OpenWeather");
  });
}

function getWeather(name, latitude, longitude) {
  var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=imperial&exclude=minutely,hourly&appid=" + apiKey;

  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        console.log(data);
      });
    } else {
      alert("Error: " + response.statusText);
    }

  }).catch(function (error) {
    alert("Unable to connect to OpenWeather");
  });
}

document.getElementById("search-btn").addEventListener("click", function (event) {
  event.preventDefault();
  getWeatherCoords();
});
