let selectedCitiesToCompare = []

const getAllCities = async () => {
  try {
    const result = await fetch('/assets/cities.min.json')
    return result.json()
  } catch (error) {
    console.error(error)
  }
}

// Transforms a city name to a chip with name and a close button to remove city from selected cities list
const buildCityChip = (city) => {
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
  nameSpan.textContent = `${city.name}, ${city.country}`
  const closeButton = document.createElement('button')
  closeButton.type = 'button'
  closeButton.classList.add('btn', 'py-0', 'px-0', 'ps-3')
  closeButton.onclick = () => removeSelectedCity(city)
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

const selectCity = (city) => {
  selectedCitiesToCompare.push(city)
  rebuildSelectedCitiesChips()
}

const removeSelectedCity = (city) => {
  selectedCitiesToCompare = selectedCitiesToCompare.filter(
    (e) => e.name !== city.name && e.country !== city.country
  )
  rebuildSelectedCitiesChips()
}

const fillCitiesSuggestions = (cities) => {
  const citiesSuggestionList = document.getElementById('cities-suggestion-list')
  const citiesInput = document.getElementById('cities-input')
  const query = citiesInput.value.toLowerCase()
  citiesSuggestionList.innerHTML = '' // Clear previous suggestions
  if (query.length < 3) return // Avoid returning too much results
  cities
    .filter((city) => {
      const searchPattern = `${city.name.toLowerCase()} ${city.country.toLowerCase()}`
      return searchPattern.includes(query)
    })
    .slice(0, 50) // Limit cities count to 50
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
        selectCity(city)
        citiesInput.value = '' // Clear query
        citiesSuggestionList.innerHTML = '' // Clear suggestions
      }
      suggestionButton.textContent = `${city.name}, ${city.country}`
      citiesSuggestionList.appendChild(suggestionButton)
    })
}

// Append cities suggestions dinamically on input change
document.getElementById('cities-input').addEventListener('input', async (_) => {
  const cities = await getAllCities()
  fillCitiesSuggestions(cities)
})
