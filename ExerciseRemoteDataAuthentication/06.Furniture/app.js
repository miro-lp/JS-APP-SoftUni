window.addEventListener('DOMContentLoaded', () => {
    onLoad()
})

async function onLoad() {
    const res = await fetch('http://localhost:3030/data/furniture')
  
    const data = await res.json()
    document.querySelector('tbody').replaceChildren(...data.map(createPteview))
  }
  
  function createPteview(data) {
  
    const trEl = document.createElement('tr')
    trEl.innerHTML = `
                <td>
                <img
                  src="${data.img}">
                </td>
                <td>
                <p>${data.name}</p>
                </td>
                <td>
                <p>${data.price}</p>
                </td>
                <td>
                <p>${data.factor}</p>
                </td>
                <td>
                <input data-id="${data._id}" type="checkbox" disabled/>
                </td>
    `
    return trEl
  }