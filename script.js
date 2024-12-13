const fetchFunc = async (url) => {
  const response = await fetch(url);
  const result = await response.json();
  return result;
};

let cities = await fetchFunc("cities.json");

let citiesGroupedByCountry = Object.groupBy(cities, ({ country }) => country);

const countrySelect = document.querySelector("#countrySelect");
const citySelect = document.querySelector("#citySelect");

const forecastOutput = document.querySelector(".forecastOutput");

Object.keys(citiesGroupedByCountry).forEach((country) => {
  const countryOption = document.createElement("option");
  countryOption.value = country;
  countryOption.textContent = country;
  countrySelect.appendChild(countryOption);
});

countrySelect.addEventListener("change", (event) => {
  const chosenCountry = event.target.value;
  const chosenCities = citiesGroupedByCountry[chosenCountry];
  for (let i = 0; i < citySelect.childNodes.length; i++) {
    citySelect.childNodes[i].remove();
  }
  chosenCities.forEach((city) => {
    const cityOption = document.createElement("option");

    const searchParams = new URLSearchParams({
      type: "all",
      lat: city.lat,
      long: city.lon,
      weather: false,
    }).toString();
    cityOption.value = searchParams;
    cityOption.textContent = city.name;
    citySelect.appendChild(cityOption);
  });
});

citySelect.addEventListener("change", async (event) => {
  const baseApiUrl = "https://api.auroras.live/v1/?";
  const searchUrl = baseApiUrl + event.target.value;
  const response = await fetchFunc(searchUrl);
  console.log(response);
  forecastOutput.childNodes.forEach((child) => child.remove());
  response.threeday.values.forEach((value) => {
    for (let i = 0; i < value.length; i++) {
      const li1 = document.createElement("li");
      li1.textContent = `${new Date(
        value[i].start
      ).toLocaleDateString()} kp value is: ${value[i].value}`;
      forecastOutput.appendChild(li1);
      limitApiList(1); 
    }
  });
});
