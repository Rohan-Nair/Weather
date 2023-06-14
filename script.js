//  complete !leftovers (done)
const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const optionContainer = document.querySelector(".optionContainer");

const grantAccessContainer = document.querySelector(".grantLocationContainer");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loadingcontainer");
const userInfoContainer = document.querySelector(".userInfoContainer");
const grantAccessButton = document.querySelector("[data-grantAccess]");
const searchInput = document.querySelector("[data-searchInput]");

let oldTab = userTab;
const API_KEY = "2c1dadf55696f1072a8ad35caffb9a5f";
getfromSessionStorage();

// seeing if the coordinates are already present in the browser session
function getfromSessionStorage() {
  const localCoordinates = sessionStorage.getItem("user-coordinates"); // getting the corrdinates
  if (!localCoordinates) {
    // if coordinates not found
    grantAccessContainer.classList.add("flex"); // make the grantAccessContainer visible to ask for access to the location
    grantAccessContainer.classList.remove("hidden");
  } else {
    // if coordinates are present then fetch the location
    const coordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
  }
}

//fetching the weather with coordinates
async function fetchUserWeatherInfo(coordinates) {
  const { lat, lon } = coordinates; // setting the latitude and longitude

  // remove asking user for location access
  grantAccessContainer.classList.add("hidden");
  grantAccessContainer.classList.remove("flex");

  // show loading screen
  loadingScreen.classList.add("flex");
  loadingScreen.classList.remove("hidden");

  // fetching the weather with the api call
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json(); // parsing to json

    // removing the loading screen
    loadingScreen.classList.add("hidden");
    loadingScreen.classList.remove("flex");

    userInfoContainer.classList.add("flex");
    userInfoContainer.classList.remove("hidden");
    // calling the function to display the weather
    renderWeatherInfo(data);
  } catch (err) {
    // if fetching fails
    // display the 404 message not found
    renderWeatherInfo(undefined);
  }
}

// function to display the fetched weather information onto the ui
function renderWeatherInfo(weatherInfo) {
  const cityName = document.querySelector("[data-cityName]");
  const countryIcon = document.querySelector("[data-countryIcon]");
  const weatherDesc = document.querySelector("[data-weatherDesc]");
  const weatherIcon = document.querySelector("[data-weatherIcon]");
  const weatherTemp = document.querySelector("[data-weatherTemp]");
  const windspeed = document.querySelector("[data-windspeed]");
  const humidity = document.querySelector("[data-humidity]");
  const cloudiness = document.querySelector("[data-cloudiness]");
  const cards = document.querySelector("[cards]");

  if (weatherInfo?.name != undefined) {
    // fetching the elements to modify on the ui

    // adding the info from the fetched weather info to the elements
    cityName.innerHTML = weatherInfo?.name;
    // using the flagpedia.net api to fetch the flag based on the name of the country
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    weatherDesc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    weatherTemp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
  } else {
    userInfoContainer.classList.add("hidden");
    loadingScreen.classList.remove("hidden");
    const loadingtext = document.querySelector("[loadingtext]");
    const loadingimage = document.querySelector("[loadingimage]");
    loadingimage.src = `img/notfound.png`;
    loadingtext.innerText = `Sorry, No Results!`;
  }
}

function switchTab(newTab) {
  if (newTab != oldTab) {
    oldTab.classList.add("bg-transparent");
    oldTab.classList.remove("bg-dPurple");
    oldTab = newTab;
    oldTab.classList.add("bg-dPurple");
    oldTab.classList.remove("bg-transparent");
  }

  if (!searchForm.classList.contains("flex")) {
    // above if condition reads: if searchForm ka classlist does not contain the flex class. meaning it is not active and the userlocation wala tab is active so now make the search section visible
    // make search section visible
    userInfoContainer.classList.add("hidden");
    userInfoContainer.classList.remove("flex");
    grantAccessContainer.classList.add("hidden");
    grantAccessContainer.classList.remove("flex");

    searchForm.classList.add("flex");
    searchForm.classList.remove("hidden");
  } else {
    // meaning searchform is active
    searchForm.classList.add("hidden");
    searchForm.classList.remove("flex");
    userInfoContainer.classList.add("hidden");
    userInfoContainer.classList.remove("flex");

    getfromSessionStorage();
  }
}

userTab.addEventListener("click", () => {
  switchTab(userTab);
});

searchTab.addEventListener("click", () => {
  switchTab(searchTab);
});

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    // !leftover
    alert("location not found");
  }
}

function showPosition(position) {
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };

  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);
}
grantAccessButton.addEventListener("click", getLocation);

// search form
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let cityName = searchInput.value;
  if (cityName == "") return;
  else {
    fetchSearchWeatherInfo(cityName);
  }
});

async function fetchSearchWeatherInfo(city) {
  loadingScreen.classList.add("flex");
  loadingScreen.classList.remove("hidden");
  userInfoContainer.classList.add("hidden");
  userInfoContainer.classList.remove("flex");
  grantAccessContainer.classList.add("hidden");
  grantAccessContainer.classList.remove("flex");

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    const data = await response.json();
    loadingScreen.classList.add("hidden");
    loadingScreen.classList.remove("flex");
    userInfoContainer.classList.add("flex");
    userInfoContainer.classList.remove("hidden");
    renderWeatherInfo(data);
  } catch (err) {
    // !leftover
    // userInfoContainer.classList.add("hidden");
    // loadingScreen.classList.remove("hidden");
    // const loadingtext = document.querySelector("[loadingtext]");
    // const loadingimage = document.querySelector("[loadingimage]");
    // loadingimage.src = `img/notfound.png`;
    // loadingtext.innerText = `Sorry, No Results!`;
  }
}
