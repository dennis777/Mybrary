import Select from './select.js'

const featureDiv = document.getElementsByClassName('unglitchBtn')[0]
const urlInput = document.getElementsByClassName('battleUrlInput')[0]
const selectElements = document.querySelectorAll('[data-custom]')

featureDiv.onclick = () => {
    let statusLbl = document.querySelectorAll('#accStatusLbl')[1]
    statusLbl.textContent = "Unglitching"
    statusLbl.style.color = 'rgb(255, 200, 73)'
    featureDiv.style.opacity = '0'
    featureDiv.style.cursor = 'default'

    setTimeout(() => {
        let statusLbl = document.querySelectorAll('#accStatusLbl')[1]
        statusLbl.textContent = "Glitched"
        statusLbl.style.color = 'rgb(109, 206, 233)'
        featureDiv.style.opacity = '1'
        featureDiv.style.cursor = 'pointer'
    }, 3000)
}

urlInput.addEventListener('keydown', (e) => {
    if (e.code === "Escape") {
        document.activeElement.blur()
    }
})

Array.from(document.getElementsByClassName('urlLbl')).forEach(urlElement => {
    urlElement.addEventListener('click', () => {
        navigator.clipboard.writeText(urlElement.innerText)
    })
})

selectElements.forEach(selectElement => {
    new Select(selectElement)
})