export default class Select {
    constructor(element) {
        this.element = element
        this.options = getFormattedOptions(element.querySelectorAll('option'))
        this.customElement = document.createElement('div')
        this.labelElement = document.createElement('span')
        this.optionsCustomElement = document.createElement('ul')
        setupCustomElement(this)
        element.style.display = "none"
        element.after(this.customElement)
    }

    get selectedOption() {
        return this.options.find(option => option.selected)
    }

    get selectedOptionIndex() {
        return this.options.indexOf(this.selectedOption)
    }

    get highlightedOption() {
        return Array.from(this.optionsCustomElement.querySelectorAll(`[data-value]`)).find(option => {
            return option.style.backgroundColor !== ""
        })
    }

    get highlightedOptionIndex() {
        return Array.from(this.optionsCustomElement.querySelectorAll(`[data-value]`)).indexOf(this.highlightedOption)
    }

    selectValue(value, deselectOnly = false) {
        const newSelectedOption = this.options.find(option => {
            return option.value === value
        })
        if (newSelectedOption == null) {
            return
        }
        newSelectedOption.selected = deselectOnly ? false : !newSelectedOption.selected
        newSelectedOption.element.selected = newSelectedOption.selected

        const newCustomElement = this.optionsCustomElement.querySelector(`[data-value=${newSelectedOption.value}]`)
        newCustomElement.classList.toggle('selected', newSelectedOption.selected)
    }

    highlightValue(value) {
        Array.from(this.optionsCustomElement.querySelectorAll(`[data-value]`)).forEach(row => {
            row.style.backgroundColor = ""
        })
        const newSelectedOption = this.options.find(option => {
            return option.value === value
        })
        const newCustomElement = this.optionsCustomElement.querySelector(`[data-value=${newSelectedOption.value}]`)
        newCustomElement.style.backgroundColor = "rgb(75, 160, 181)"
        newCustomElement.scrollIntoView({ block: 'nearest' })
    }
}

function setupCustomElement(select) {
    select.customElement.classList.add('custom-select-container')
    select.customElement.name = select.element.name
    select.customElement.tabIndex = 0

    select.labelElement.classList.add('custom-select-value')
    select.labelElement.innerText = select.element.name
    select.customElement.append(select.labelElement)

    select.optionsCustomElement.classList.add('custom-select-options')
    select.options.forEach(option => {
        const optionElement = document.createElement('li')
        optionElement.classList.add('custom-select-option')
        option.selected = false
        optionElement.classList.toggle('selected', option.selected)
        optionElement.innerHTML = getHtmlElementWith(1, option.label)
        optionElement.dataset.value = option.value
        optionElement.addEventListener('click', (e) => {
            if (!e.shiftKey) {
                select.selectValue(option.value)
            } else {
                handleMultiSelection()
            }
        })
        optionElement.addEventListener('mouseover', () => {
            Array.from(select.optionsCustomElement.querySelectorAll(`[data-value]`)).filter(row => {
                return (row.dataset.value !== optionElement.dataset.value) && (row.style.backgroundColor !== "")
            }).forEach(row => {
                row.style.backgroundColor = ""
            })
        })
        select.optionsCustomElement.append(optionElement)
    })
    select.customElement.append(select.optionsCustomElement)

    let debounceTimeout
    let searchTerm = ""

    select.customElement.addEventListener('keydown', (e) => {
        switch (e.code) {
            case "Enter": {
                e.preventDefault()
                const currentOption = select.options[select.highlightedOptionIndex]
                if (currentOption) {
                    select.selectValue(currentOption.value)
                }
                break
            }
            case "Escape":
                e.preventDefault()
                let selectedAccounts = Array.from(document.querySelectorAll(`[data-value]`)).filter(row => {
                    return row.classList.contains('selected')
                })
                if (selectedAccounts.length !== 0) {
                    selectedAccounts.forEach(row => {
                        select.selectValue(row.dataset.value, true)
                    })
                } else {
                    document.activeElement.blur()
                }
                break
            default: {
                clearTimeout(debounceTimeout)
                searchTerm += e.key
                debounceTimeout = setTimeout(() => {
                    searchTerm = ""
                }, 500)

                const searchedOption = select.options.find(option => {
                    return option.label.toLowerCase().startsWith(searchTerm)
                })
                if (searchedOption) {
                    select.highlightValue(searchedOption.value)
                }
            }
        }
    })

    function handleMultiSelection() {
        let selectedAccounts = select.options.filter(option => option.selected).map(account => select.options.indexOf(account))
        let hoveredElement = Array.from(document.querySelectorAll(":hover")).filter(element => element.matches('[data-value]'))
        if (hoveredElement.length > 1) {
            return
        }

        let highlighedOption = Array.from(select.optionsCustomElement.children).filter(child => {
            return child.dataset.value === hoveredElement[0].dataset.value
        })
        if (highlighedOption.length > 1) {
            return
        }

        let highlightedOptionIndex = Array.from(select.optionsCustomElement.children).indexOf(highlighedOption[0])
        let largestSelectedIndex = Math.max(...selectedAccounts)

        if (highlightedOptionIndex > largestSelectedIndex) {
            for (let i = largestSelectedIndex+1; i <= highlightedOptionIndex; i++) {
                select.selectValue(select.options[i].value)
            }
        } else if (largestSelectedIndex > highlightedOptionIndex) {
            for (let i = largestSelectedIndex; i > highlightedOptionIndex; i--) {
                select.selectValue(select.options[i].value, true)
            }
        } 
    }
}

function getFormattedOptions(optionElements) {
    return [...optionElements].map(optionElement => {
        return {
            value: optionElement.value,
            label: optionElement.label,
            selected: optionElement.selected,
            element: optionElement
        }
    })
}

function getHtmlElementWith(rank, username) {
    return `<img src="./Assets/${rank}.png" class="custom-select-img"><span class="custom-select-label">${username}</span>`
}