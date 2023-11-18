import '../css/app.css'
import { InputSubject, BtnGenerateSubject } from './observer'

document.addEventListener('DOMContentLoaded', function () {
  const cloneButton = document.querySelector('.clone-button')
  const wrapper = document.querySelector('.wrapper-repeater')
  selectAttr()
  changeAttrProduct()

  if (cloneButton) {
    cloneButton.addEventListener('click', function () {
      cloneChild()
    })
  }

  if (wrapper) {
    wrapper.addEventListener('click', function (event) {
      if (event.target.classList.contains('delete-children-repeater')) {
        const parentElement = event.target.parentNode
        if (parentElement.parentElement.childElementCount > 1) {
          parentElement.parentNode.removeChild(parentElement)
        }
      }
    })
  }

  function cloneChild() {
    const originalDiv = document.querySelector('.children-repeater')
    if (wrapper.childElementCount <= 0) {
      // wrapper.innerHTML = divToClone
    } else {
      if (originalDiv) {
        const clonedDiv = originalDiv.cloneNode(true)
        clonedDiv.querySelector('.input-hidden-attr').value = ''
        clonedDiv.querySelector('.group-data-attr').innerHTML = ''

        wrapper.appendChild(clonedDiv)
        // selectAttr()
      }
    }
  }

  generateVariationsProducts()
})

function selectAttr() {
  document.addEventListener('input', function (e) {
    if (e.target && e.target.classList.contains('search-value-input-attr')) {
      const value = e.target.value
      const ul = e.target.parentElement.parentElement.querySelector('.ul-data-list-attr')
      const children = ul.children
      for (var i = 0; i < children.length; i++) {
        if (children[i].innerText.includes(value)) {
          children[i].style.display = 'block'
        } else {
          children[i].style.display = 'none'
        }
      }
    }
  })

  document.addEventListener('click', function (e) {
    if (
      !e.target.classList.contains('search-value-input-attr') &&
      !e.target.classList.contains('dropdown-multiselect-attr')
    ) {
      document.querySelectorAll('.dropdown-multiselect-attr').forEach((ul) => {
        ul.classList.add('hidden')
      })
    }

    if (e.target && e.target.classList.contains('search-value-input-attr')) {
      const inputHidden = e.target.parentElement.parentElement.querySelector('.input-hidden-attr')
      const arrIds = inputHidden.value.split('|')

      const ul = e.target.parentElement.parentElement.querySelector('.dropdown-multiselect-attr')
      ul.querySelectorAll('.list-multipleselect-attr').forEach((e) => {
        e.style.opacity = '1'
        e.style.pointerEvents = 'auto'
      })
      if (arrIds.length > 0) {
        for (const id of arrIds) {
          const li = ul.querySelector(`li.list-multipleselect-attr[data-id="${id}"]`)
          if (li) {
            li.style.opacity = '0.4'
            li.style.pointerEvents = 'none'
          }
          // ul.querySelector(`li.list-multipleselect-attr[data-id="${id}"]`).disable = true
        }
      }
      ul.classList.remove('hidden')
    }
    if (e.target && e.target.classList.contains('list-multipleselect-attr')) {
      const inputHidden =
        e.target.parentElement.parentElement.parentElement.querySelector('.input-hidden-attr')
      let valueInputHidden = inputHidden.value
      let arrayValues = valueInputHidden.split('|')
      let id = e.target.getAttribute('data-id')
      if (!arrayValues.includes(id)) {
        id = valueInputHidden + '|' + id
        if (id[0] === '|') {
          id = id.substring(1)
        }
      } else {
        id = valueInputHidden
      }
      inputHidden.value = `${id}`
      let arrSpan = inputHidden.value.split('|')
      const groupData =
        e.target.parentElement.parentElement.parentElement.querySelector('.group-data-attr')
      groupData.innerHTML = ''
      for (const id of arrSpan) {
        let text = e.target.parentElement.querySelector(
          `li.list-multipleselect-attr[data-id="${id}"]`
        ).innerText

        const span = createSpans(id, text)
        groupData.appendChild(span)
      }
    }
    if (e.target && e.target.classList.contains('item-multiple-selected')) {
      const id = e.target.getAttribute('data-id')
      const inputHidden =
        e.target?.parentElement?.parentElement?.parentElement?.querySelector('.input-hidden-attr')

      if (inputHidden) {
        const arrValues = inputHidden.value.split('|')
        const newArr = arrValues.filter((e) => e !== id)
        inputHidden.value = newArr.join('|')
        const groupData = e.target.closest('.group-data-attr')

        const spanToRemove = groupData.querySelector(`span[data-id="${id}"]`)
        if (spanToRemove) {
          spanToRemove.remove()
        }

        if (inputHidden.value === '') {
          groupData.innerHTML = ''
        }
      }
    }
  })
}

function createSpans(id, text) {
  const span = document.createElement('span')
  span.setAttribute('data-id', id)
  span.classList.add(
    'bg-darkbg',
    'rounded-full',
    'text-xs',
    'text-darktext',
    'px-2',
    'py-1',
    'select-none',
    'item-multiple-selected'
  )
  const spanText = document.createTextNode(text)
  span.appendChild(spanText)
  return span
}

function changeAttrProduct() {
  document.addEventListener('change', (ev) => {
    if (ev.target && ev.target.classList.contains('select-attributes')) {
      ev.target.parentElement.parentElement
        .querySelector('.input-hidden-attr')
        .setAttribute('data-select', ev.target.value)
    }
  })
}
function showVariations(variations, inputHidden) {
  document.querySelectorAll(`.${inputHidden}`).forEach((e) => {
    let obj = {
      id: e.getAttribute('data-select'),
      values: e.value ? e.value.split('|') : [],
    }
    const exists = variations.find((e) => e.id === obj.id)
    if (!exists) {
      variations.push(obj)
    }
  })
  const arrays = variations.map((e) => e.values)
  if (arrays.length > 0) {
    const combinaciones = makeVariations(arrays)
    createTableVariations(combinaciones)
  }
  console.log(arrays)
}
function generateVariationsProducts() {
  let canGenerate = false
  const btn = 'btn-generate-variations'
  const li = 'list-multipleselect-attr'
  const span = 'item-multiple-selected'
  const inputHidden = 'input-hidden-attr'
  const btnDeleteAttr = 'delete-children-repeater'
  let variations = []

  document.addEventListener('change', (ev) => {
    if (ev.target && ev.target.classList.contains('select-attributes')) {
      console.log('change')
      variations = []
      showVariations(variations, inputHidden)
    }
  })
  document.addEventListener('click', (ev) => {
    if (ev.target && ev.target.classList.contains(btn)) {
      variations = []
      showVariations(variations, inputHidden)
    }
    if (
      ev.target &&
      (ev.target.classList.contains(btnDeleteAttr) ||
        ev.target.classList.contains(li) ||
        ev.target.classList.contains(span))
    ) {
      variations = []
      // document.querySelectorAll(`.${inputHidden}`).forEach((e) => {
      //   let obj = {
      //     id: e.getAttribute('data-select'),
      //     values: e.value ? e.value.split('|') : [],
      //   }
      //   const exists = variations.find((e) => e.id === obj.id)
      //   if (!exists) {
      //     variations.push(obj)
      //   }
      // })
      showVariations(variations, inputHidden)
    }
  })
}

function makeVariations(arrays) {
  if (arrays.length === 1) {
    return arrays[0].map((elemento) => [elemento])
  }
  const combinacionesRestantes = makeVariations(arrays.slice(1))
  const combinaciones = []
  arrays[0].forEach((elemento) => {
    combinacionesRestantes.forEach((combinacionRestante) => {
      combinaciones.push([elemento, ...combinacionRestante])
    })
  })
  return combinaciones
}

function createTableVariations(data) {
  const table = document.querySelector('#table-product-variations')
  table.innerHTML = ''
  for (let i = 0; i < data.length; i++) {
    // Crea una nueva fila
    const rowParent = document.createElement('div')
    rowParent.classList.add(
      'flex',
      'items-center',
      'justify-between',
      'w-auto',
      'hover:bg-white',
      'rounded-sm',
      'flex-row'
    )
    const row1 = document.createElement('div')
    row1.classList.add(
      'flex',
      'items-center',
      'justify-between',
      'w-auto',
      'hover:bg-white',
      'rounded-sm',
      'flex-wrap',
      'mr-2'
    )
    const row2 = document.createElement('div')
    row2.classList.add(
      'flex',
      'items-center',
      'justify-center',
      'gap-1',
      'hover:bg-white',
      'rounded-sm',
      'flex-wrap'
    )
    table.appendChild(rowParent)
    rowParent.appendChild(row1)
    rowParent.appendChild(row2)
    // Crea las celdas en la fila
    let celda1 = document.createElement('div')
    let celda = document.createElement('div')
    celda.classList.add('w-auto')
    let celda2 = celda.cloneNode(true)
    let celda3 = celda.cloneNode(true)
    let celda4 = celda.cloneNode(true)
    let celda5 = celda.cloneNode(true)
    row1.appendChild(celda1)
    row2.appendChild(celda2)
    row2.appendChild(celda3)
    row2.appendChild(celda4)
    row2.appendChild(celda5)

    celda1.classList.add('flex', 'flex-col')
    for (const id of data[i]) {
      const spanText = document.createElement('span')
      spanText.classList.add('text-xs', 'w-full', 'text-center', 'text-whitetext')
      let text = attributesOption.find((e) => `${e.id}` === `${id}`)
      spanText.innerText = text.value
      celda1.appendChild(spanText)
    }

    // Agrega contenido a las celdas
    celda2.innerHTML =
      "<input placeholder='SKU' type='text' class='bg-transparent w-auto text-xs h-8 p-2 rounded-md border-[1px]'>"
    celda3.innerHTML =
      "<input placeholder='Stock' type='number' class='bg-transparent w-auto text-xs h-8 p-2 rounded-md border-[1px]'>"
    celda4.innerHTML =
      "<input placeholder='Precio normal' type='text' class='bg-transparent w-auto text-xs h-8 p-2 rounded-md border-[1px]'>"
    celda5.innerHTML =
      "<input placeholder='Precio descuento' type='text' class='bg-transparent w-auto text-xs h-8 p-2 rounded-md border-[1px]'>"
  }
}
