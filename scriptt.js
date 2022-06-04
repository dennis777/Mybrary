import Select from './select.js'

const selectElements = document.querySelectorAll('[data-custom]')
document.getElementsByTagName('body')[0].style.background = "rgb(19, 22, 51)"

selectElements.forEach(selectElement => {
    new Select(selectElement)
})

