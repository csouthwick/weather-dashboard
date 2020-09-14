var cityInputEl = document.getElementById("city-input");
var weatherEl = document.getElementById("weather");
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
        displayWeather(name, data);
      });
    } else {
      alert("Error: " + response.statusText);
    }

  }).catch(function (error) {
    alert("Unable to connect to OpenWeather");
  });
}

function displayWeather(name, weatherData) {
  // start of current weather card
  var tempHTML = "<div class='card'><div class='card-body'>";
  var date = moment.unix(weatherData.current.dt).format("M/D/YYYY");

  // card title with city name, date, and weather icon
  tempHTML += "<h2 class='card-title'>" + name + " (" + date + ") ";
  tempHTML += "<img src='http://openweathermap.org/img/wn/" + weatherData.current.weather[0].icon + ".png' alt='" + weatherData.current.weather[0].description + "' /></h3>";

  // temp, humidity, wind speed, and start of UV index
  tempHTML += "<p class='card-text'>Temperature: " + weatherData.current.temp + " &deg;F</p>";
  tempHTML += "<p class='card-text'>Humidity: " + weatherData.current.humidity + "%</p>";
  tempHTML += "<p class='card-text'>Wind Speed: " + weatherData.current.wind_speed + " MPH</p>";
  tempHTML += "<p class='card-text'>UV Index: <span class='badge ";

  // Determine color for UV scale, added as a class name
  // Only need to test if uvi is lower than the next threshold as earlier if statements will catch the lower bounds. Last check is for any other number which is automatically 11+
  if (weatherData.current.uvi < 3) {
    tempHTML += "low-uv";
  } else if (weatherData.current.uvi < 6) {
    tempHTML += "moderate-uv";
  } else if (weatherData.current.uvi < 8) {
    tempHTML += "high-uv";
  } else if (weatherData.current.uvi < 11) {
    tempHTML += "very-high-uv";
  } else {
    tempHTML += "extreme-uv";
  }
  tempHTML += "'>" + weatherData.current.uvi + "</span></p>";

  // close the current weather card
  tempHTML += "</div></div>";

  // create a div for the forecast

  tempHTML += "<div class='forecast'><h3>5-Day Forecast:</h3>";
  // bootstrap grid doesn't have the divisions we want for 5 items, just use a regular flexbox
  tempHTML += "<div class='d-md-flex justify-content-between'>";

  // loop through the days, current day is 0 and can be skipped
  for (var i = 1; i < 6; i++) {
    date = moment.unix(weatherData.daily[i].dt).format("M/D/YYYY");
    tempHTML += "<div class='card bg-primary text-white flex-grow-1'><div class='card-body'>";
    tempHTML += "<h4 class='card-title'>" + date + "</h4>";
    tempHTML += "<img src='http://openweathermap.org/img/wn/" + weatherData.daily[i].weather[0].icon + "@2x.png' alt='" + weatherData.daily[i].weather[0].description + "' />";
    tempHTML += "<p class='card-text'>Temp: " + weatherData.daily[i].temp.day + " &deg;F</p>";
    tempHTML += "<p class='card-text'>Humidity: " + weatherData.daily[i].humidity + "%</p>";
    tempHTML += "</div></div>";
  }

  // close flex div and forecast div
  tempHTML += "</div></div>";

  // test current progress
  weatherEl.innerHTML = tempHTML;
}

document.getElementById("search-btn").addEventListener("click", function (event) {
  event.preventDefault();
  getWeatherCoords();
});
