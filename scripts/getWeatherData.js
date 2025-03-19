const entryPoint = document.getElementById('entry-point')
let weatherData = []

const clearSelectedCities = () => {
  selectedCitiesToCompare = []
  rebuildSelectedCitiesChips()
}

const getWeatherData = async (cities) => {
  try {
    const requests = cities.map((city) =>
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lng}&units=metric&appid=1d10f620730187512b34c5e9f71377b4`
      )
    )
    const response = await Promise.all(requests)
    clearSelectedCities()
    entryPoint.innerHTML = ''
    const errorOccurred = response.some((promise) => !promise.ok)
    if (errorOccurred) {
      throw new Error('Some response has not status OK')
    }
    weatherData = await Promise.all(response.map((result) => result.json()))
    console.log(weatherData)
  } catch (error) {
    console.error(error)
    displayError()
  }
}

document
  .getElementById('compare-button')
  .addEventListener('click', (_) => getWeatherData(selectedCitiesToCompare))

const displayError = () => {
  const alert = document.createElement('div')
  alert.classList.add('alert', 'alert-danger')
  alert.role = 'alert'
  alert.innerText = 'An error occurred while fetching weather info, try again'
  entryPoint.appendChild(alert)
}
