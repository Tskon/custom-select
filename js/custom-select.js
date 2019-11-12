function initCustomSelects(selector = '.js-custom-select') {
  const SELECT_CLASS = 'custom-select'
  const SELECT_TRIGGER_CLASS = 'custom-select-trigger'
  const OPTION_LIST_CLASS = 'custom-select-list'
  const OPTION_LIST_HIDDEN_CLASS = 'custom-select-list-hidden'

  const selectorList = [...document.querySelectorAll(selector)]
  selectorList.forEach(initCustomSelect)

  function initCustomSelect(select) {
    const parsedOptionList = parseOptions(select)

    const customSelect = document.createElement('div')
    customSelect.className = SELECT_CLASS
    const optionList = document.createElement('div')
    optionList.className = OPTION_LIST_CLASS + ' ' + OPTION_LIST_HIDDEN_CLASS

    const trigger = renderTrigger(parsedOptionList[0])
    trigger.addEventListener('click', (e) => {
      e.stopPropagation()
      optionList.classList.toggle(OPTION_LIST_HIDDEN_CLASS)
      window.addEventListener('click', hideOptionList)
    })
    customSelect.appendChild(trigger)

    parsedOptionList.forEach(option => {
      const newOption = renderOption(option)
      newOption.addEventListener('click', () => {
        select.value = option.value
        trigger.innerHTML = getOptionContent(option)
        optionList.classList.add(OPTION_LIST_HIDDEN_CLASS)
        window.removeEventListener('click', hideOptionList)
      })
      optionList.appendChild(newOption)
    })
    customSelect.appendChild(optionList)

    select.parentNode.insertBefore(customSelect, select)

    const selectWidth = customSelect.querySelector('.' + OPTION_LIST_CLASS).clientWidth
    customSelect.style.width = selectWidth + 'px'

    function hideOptionList () {
      optionList.classList.add(OPTION_LIST_HIDDEN_CLASS)
    }
  }

  function parseOptions(select) {
    const options = [...select.querySelectorAll('option')]
    const parsedOptionList = []

    options.forEach(option => {
      const parsedOption = {}

      parsedOption.value = option.value

      const htmlContent = option.dataset.html
      if (htmlContent) {
        parsedOption.content = htmlContent
      } else {
        parsedOption.content = option.innerHTML
      }

      const image = option.dataset.image
      if (image) parsedOption.image = image

      parsedOptionList.push(parsedOption)
    })

    return parsedOptionList
  }

  function renderTrigger(activeOption) {
    const trigger = document.createElement('button')
    trigger.className = SELECT_TRIGGER_CLASS
    trigger.type = 'button'
    trigger.innerHTML = getOptionContent(activeOption)

    return trigger
  }

  function renderOption(parsedOption) {
    const option = document.createElement('button')
    option.type = 'button'
    option.className = 'custom-select-option'
    option.innerHTML = getOptionContent(parsedOption)

    return option
  }

  function getOptionContent(parsedOption) {
    let content = ''
    if (parsedOption.image) {
      content = `<img class="custom-select-preview" src="${parsedOption.image}" title="${parsedOption.value}">`
    }
    return content += parsedOption.content
  }
}

initCustomSelects()