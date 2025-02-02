// Initialize tooltips tool
;[...document.querySelectorAll('[data-bs-toggle="tooltip"]')].map(
  (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
)

let selectedCitiesToCompare = []

const readCities = async () => {
  try {
    const result = await fetch('/assets/cities.min.json')
    return result.json()
  } catch (error) {
    console.error(error)
  }
}

// Transforms a city name to a chip with that name and a close button to remove city from selected cities list
const buildCityChip = (cityName) => {
  const element = document.createElement('div')
  element.classList.add(
    'selected-city',
    'text-body-secondary',
    'border',
    'rounded',
    'rounded-4',
    'pt-2',
    'px-3'
  )
  const nameSpan = document.createElement('span')
  nameSpan.textContent = cityName
  const closeButton = document.createElement('button')
  closeButton.type = 'button'
  closeButton.classList.add('btn', 'py-0', 'px-0', 'ps-3')
  closeButton.onclick = () => removeSelectedCity(cityName)
  const icon = document.createElement('span')
  icon.classList.add('material-symbols-outlined')
  icon.textContent = 'close'
  closeButton.appendChild(icon)
  element.appendChild(nameSpan)
  element.appendChild(closeButton)
  return element
}

const rebuildSelectedCitiesChips = () => {
  const selectedCitiesCard = document.getElementById('selected-cities-card')
  const selectedCitiesContainer = document.getElementById(
    'selected-cities-container'
  )
  selectedCitiesContainer.innerHTML = ''
  if (selectedCitiesToCompare.length === 0) {
    selectedCitiesCard.classList.add('d-none')
  } else {
    selectedCitiesCard.classList.remove('d-none')
  }
  selectedCitiesToCompare.forEach((city) =>
    selectedCitiesContainer.appendChild(buildCityChip(city))
  )
}

const selectCity = (cityName) => {
  selectedCitiesToCompare.push(cityName)
  rebuildSelectedCitiesChips()
}

const removeSelectedCity = (cityName) => {
  selectedCitiesToCompare = selectedCitiesToCompare.filter(
    (e) => e !== cityName
  )
  rebuildSelectedCitiesChips()
}

const fillCitiesSuggestions = (cities) => {
  const citiesSuggestionList = document.getElementById('cities-suggestion-list')
  const citiesInput = document.getElementById('cities-input')
  const query = citiesInput.value.toLowerCase()
  citiesSuggestionList.innerHTML = ''
  if (query.length < 3) return
  cities
    .filter((city) => {
      const searchPattern = `${city.name.toLowerCase()} ${city.country.toLowerCase()}`
      return searchPattern.includes(query)
    })
    .slice(0, 50)
    .forEach((city) => {
      const suggestionButton = document.createElement('button')
      suggestionButton.type = 'button'
      suggestionButton.classList.add(
        'list-group-item',
        'list-group-item-action',
        'city-suggestion',
        'fw-light'
      )
      suggestionButton.onclick = () => {
        selectCity(city.name)
        citiesInput.value = ''
        citiesSuggestionList.innerHTML = ''
      }
      suggestionButton.textContent = `${city.name}, ${city.country}`
      citiesSuggestionList.appendChild(suggestionButton)
    })
}

// Append cities suggestions dinamically on input change
document.getElementById('cities-input').addEventListener('input', async (_) => {
  const cities = await readCities()
  fillCitiesSuggestions(cities)
})

// Configure display mode switcher
{
  const displayModeSwitcher = document.getElementById('display-mode-selector')
  displayModeSwitcher.addEventListener('click', (_) => {
    const htmlElement = document.getElementsByTagName('html')[0]
    const toggledDisplayMode =
      {
        light: 'dark',
        dark: 'light',
      }[htmlElement.getAttribute('data-bs-theme')] || 'light'

    const icon = document.getElementById('display-mode-selector-icon')
    const toggledIcon =
      {
        light_mode: 'dark_mode',
        dark_mode: 'light_mode',
      }[icon.textContent] || 'light_mode'

    const toggledTooltip =
      {
        light_mode: 'Switch to dark theme',
        dark_mode: 'Switch to light theme',
      }[icon.textContent] || 'light_mode'

    htmlElement.setAttribute('data-bs-theme', toggledDisplayMode)
    icon.textContent = toggledIcon
    bootstrap.Tooltip.getInstance(displayModeSwitcher).setContent({
      '.tooltip-inner': toggledTooltip,
    })
  })
}
