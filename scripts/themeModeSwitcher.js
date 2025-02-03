const displayModeSwitcher = document.getElementById('display-mode-selector')
displayModeSwitcher.addEventListener('click', () => {
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
