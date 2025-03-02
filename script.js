const searchButton = document.getElementById("search");
const inputDestination = document.getElementById("inputDestination");
const menuCheckbox = document.getElementById("menuCheckbox");
const menuItems = document.querySelector(".navbar .menu-items");
const hamburger = document.getElementById("hamburger");

document.addEventListener("click", function (event) {
  // Check if the click is outside of the menu or hamburger icon
  if (
    !event.target.closest(".navbar") &&
    !event.target.closest("#menuCheckbox") &&
    !event.target.closest("#hamburger")
  ) {
    console.log("Closing menu");
    menuCheckbox.checked = false;
    menuItems.classList.remove("active");
  }
});

menuCheckbox.addEventListener("change", function () {
  if (menuCheckbox.checked) {
    menuItems.classList.add("active");
  } else {
    menuItems.classList.remove("active");
  }
});

const searchDestination = () => {
  const inputValue = inputDestination.value.trim().toLowerCase();
  if (inputValue === "") {
    return;
  }

  const searchResult = document.getElementById("searchResult");
  searchResult.innerHTML = "";

  fetch("travel_recommendation.json")
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      const allDestinations = [
        ...data.countries.flatMap((country) => country.cities),
        ...data.temples,
        ...data.beaches,
      ];

      const destination = allDestinations.find((item) => {
        return item.name.toLowerCase().includes(inputValue);
      });

      if (destination) {
        // Display city details with time in the corner
        searchResult.innerHTML = `
          <div class="destination-card">
            <h3>${destination.name}</h3>
            <div class="image-container">
              <img src="${destination.imageUrl}" alt="${destination.name}" class="destination-image" />
              <p class="city-time" id="cityTime"></p>
            </div>
            <p>${destination.description}</p>
          </div>
        `;

        // Show city time
        showCityTime(destination.name);
      } else {
        searchResult.innerHTML = "<p>No destination found.</p>";
      }
    })
    .catch((error) => console.error("Error fetching data:", error));
};

searchButton.addEventListener("click", searchDestination);

const showCityTime = (cityName) => {
  const cityTimeElement = document.getElementById("cityTime");

  // Map city names to time zones
  const timeZones = {
    "Sydney, Australia": "Australia/Sydney",
    "Melbourne, Australia": "Australia/Melbourne",
    "Tokyo, Japan": "Asia/Tokyo",
    "Kyoto, Japan": "Asia/Tokyo",
    "Rio de Janeiro, Brazil": "America/Sao_Paulo",
    "São Paulo, Brazil": "America/Sao_Paulo",
  };

  const timeZone = timeZones[cityName];

  if (timeZone) {
    const currentTime = new Date().toLocaleTimeString("en-US", {
      timeZone: timeZone,
      hour12: true,
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });

    cityTimeElement.textContent = `${currentTime}`;
  } else {
    console.error("Time zone not found for this city");
  }
};
