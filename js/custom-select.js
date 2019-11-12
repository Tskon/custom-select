function initCustomSelects(selector = '.js-custom-select') {
  const SELECT_CLASS = 'custom-select'
  const SELECT_TRIGGER_CLASS = 'custom-select-trigger'
  const OPTION_LIST_CLASS = 'custom-select-list'
  const OPTION_LIST_SHOW_CLASS = 'show'
  const SELECT_OPTION_CLASS = 'custom-select-option'

  const selectorList = [...document.querySelectorAll(selector)]
  selectorList.forEach(initCustomSelect)

  function initCustomSelect(select) {
    const parsedOptionList = parseOptions(select)

    const customSelect = document.createElement('div')
    customSelect.className = SELECT_CLASS
    const optionList = document.createElement('div')
    optionList.className = OPTION_LIST_CLASS

    const trigger = renderTrigger(parsedOptionList[0])
    trigger.addEventListener('click', (e) => {
      e.stopPropagation()
      customSelect.classList.toggle(OPTION_LIST_SHOW_CLASS)
      const activeEl = document.querySelector(`.${SELECT_OPTION_CLASS}[data-value="${select.value}"]`)
      activeEl.focus()
      window.addEventListener('keydown', keyHandler)
      window.addEventListener('click', hideOptionList)
    })
    customSelect.appendChild(trigger)

    parsedOptionList.forEach(option => {
      const newOption = renderOption(option)
      newOption.addEventListener('click', () => {
        select.value = option.value
        trigger.innerHTML = getOptionContent(option)
        customSelect.classList.remove(OPTION_LIST_SHOW_CLASS)
        window.removeEventListener('click', hideOptionList)
      })
      optionList.appendChild(newOption)
    })
    customSelect.appendChild(optionList)

    select.parentNode.insertBefore(customSelect, select)

    const selectWidth = customSelect.querySelector('.' + OPTION_LIST_CLASS).clientWidth
    customSelect.style.width = (selectWidth + 2) + 'px' // 2px - border

    function hideOptionList () {
      customSelect.classList.remove(OPTION_LIST_SHOW_CLASS)
      window.removeEventListener('keydown', keyHandler)
    }

    function keyHandler (e) {
      if (e.code === 'Tab' || e.code === 'ArrowUp' || e.code === 'ArrowDown') {
        e.preventDefault()
      } else {
        return
      }

      const selectors = (e.code === 'Tab') ? 'button, a, input, textarea' : '.' + SELECT_OPTION_CLASS
      const selectableElements = [...optionList.querySelectorAll(selectors)]
      let focusedElIndex = selectableElements.findIndex(el => el === document.activeElement)
      if (focusedElIndex === -1) focusedElIndex = 0

      if (e.code === 'ArrowDown' || (e.code === 'Tab' && !e.shiftKey)) {
        focusedElIndex = (focusedElIndex === selectableElements.length - 1) ? 0 : focusedElIndex + 1
      }

      if (e.code === 'ArrowUp' || (e.code === 'Tab' && e.shiftKey)) {
        focusedElIndex = (focusedElIndex === 0) ? selectableElements.length - 1 : focusedElIndex - 1
      }

      selectableElements[focusedElIndex].focus()
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
    option.className = SELECT_OPTION_CLASS
    option.innerHTML = getOptionContent(parsedOption)
    option.dataset.value = parsedOption.value

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