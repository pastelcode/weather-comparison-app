const entryPoint = document.getElementById('entry-point')
const canvasContainer = document.getElementById('chart')

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
    canvasContainer.innerHTML = ''
    const errorOccurred = response.some((promise) => !promise.ok)
    if (errorOccurred) {
      throw new Error('Some response has not status OK')
    }
    const weatherData = await Promise.all(
      response.map((result) => result.json())
    )
    weatherData.forEach((weatherData) => createCityWeatherCard(weatherData))
    createTemperatureChart(weatherData)
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

const createCityWeatherCard = (weatherData) => {
  const rowClasses = [
    'd-flex',
    'align-items-center',
    'justify-content-center',
    'gap-2',
  ]

  const mapIcon = document.createElement('span')
  mapIcon.classList.add('material-symbols-outlined')
  mapIcon.innerText = 'map'

  const temperatureIcon = document.createElement('span')
  temperatureIcon.classList.add('material-symbols-outlined')
  temperatureIcon.innerText = 'thermometer'

  const cloudIcon = document.createElement('span')
  cloudIcon.classList.add('material-symbols-outlined')
  cloudIcon.innerText = 'partly_cloudy_day'

  const humidityIcon = document.createElement('span')
  humidityIcon.classList.add('material-symbols-outlined')
  humidityIcon.innerText = 'humidity_percentage'

  const card = document.createElement('div')
  card.classList.add(
    'card',
    'text-center',
    'mb-3',
    'w-50',
    'mx-auto',
    'shadow',
    'rounded-4'
  )

  const cardBody = document.createElement('div')
  cardBody.classList.add('card-body')

  const cityName = document.createElement('h5')
  cityName.classList.add('card-title', ...rowClasses, 'mb-3')
  cityName.appendChild(mapIcon)
  cityName.append(`${weatherData.name}, ${weatherData.sys.country}`)

  const description = document.createElement('p')
  description.classList.add('card-text', ...rowClasses)
  description.appendChild(cloudIcon)
  description.append(weatherData.weather[0].description)

  const temperature = document.createElement('p')
  temperature.classList.add('card-text', ...rowClasses)
  temperature.appendChild(temperatureIcon)
  temperature.append(`Temperature: ${weatherData.main.temp} °C`)

  const humidity = document.createElement('p')
  humidity.classList.add('card-text', ...rowClasses)
  humidity.appendChild(humidityIcon)
  humidity.append(`Humidity: ${weatherData.main.humidity}%`)

  cardBody.appendChild(cityName)
  cardBody.appendChild(description)
  cardBody.appendChild(temperature)
  cardBody.appendChild(humidity)
  card.appendChild(cardBody)
  entryPoint.appendChild(card)
}

const createTemperatureChart = (weatherData) => {
  const canvas = document.createElement('canvas')
  canvasContainer.appendChild(canvas)
  new Chart(canvas, {
    type: 'bar',
    data: {
      labels: weatherData.map((cityData) => cityData.name),
      datasets: [
        {
          label: 'Temperature °C',
          data: weatherData.map((cityData) => cityData.main.temp),
          borderWidth: 2,
          borderRadius: 5,
          borderSkipped: false,
          // borderColor: Utils.CHART_COLORS.blue,
          // backgroundColor: Utils.transparentize(Utils.CHART_COLORS.blue, 0.5),
        },
      ],
    },
    plugins: {
      colors: {
        forceOverride: true,
      },
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  })
}
