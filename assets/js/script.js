var cityInputEl = document.getElementById("city-input");

function getWeather() {
  var apiKey = "b0c7f7890fd4b66f3bf5aff8377ec0db";
  var city = cityInputEl.value;
  var apiUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey;

  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        console.log(data);
      });
    } else {
      alert("Error: " + response.statusText);
    }

  }).catch(function (error) {
    alert("Unable to connect to GitHub");
  });
}

document.getElementById("search-btn").addEventListener("click", function (event) {
  event.preventDefault();
  getWeather();
});
