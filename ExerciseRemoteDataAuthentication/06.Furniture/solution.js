function solve() {
  userData = JSON.parse(sessionStorage.getItem('userData'))
  document.querySelector('form').addEventListener('submit', createSubmit)
  document.querySelectorAll('button')[1].addEventListener('click', buyFurniture)
  document.querySelectorAll('button')[2].addEventListener('click', allFurnitures)
  document.getElementById('logoutBtn').addEventListener('click',onLogout)
}
solve()
onLoad()

async function createSubmit(e) {
  e.preventDefault()

  const formData = new FormData(e.target)

  const data = [...formData.entries()].reduce((a, [k, v]) => Object.assign(a, { [k]: v }), {})
  try {

    if (Object.values(data).some(x => x == '')) {
      throw new Error('All fields are requered')
    }
    const res = await fetch(`http://localhost:3030/data/furniture`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': userData.token
      },
      body: JSON.stringify(data)
    })

    if (res.ok != true) {
      const error = await res.json()
      throw new Error(error.message)
    }

    e.target.reset()

  } catch (error) {
    alert(error.message)

  }
  onLoad()

}

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
              <input data-id="${data._id}" type="checkbox"/>
              </td>
  `
  return trEl
}

async function buyFurniture() {
  const dataFurnitureBuy = []
  const inputCheckboxes = document.querySelector('tbody').querySelectorAll('input')
  for (let input of inputCheckboxes) {
    if (input.checked == true) {
      const name = input.parentElement.parentElement.querySelectorAll('td p')[0].textContent
      const price = input.parentElement.parentElement.querySelectorAll('td p')[1].textContent
      dataFurnitureBuy.push({ name, price })
    }
  }
  try {

    if (dataFurnitureBuy.length == 0) {
      throw new Error('Choose a furniture')
    }
    const res = await fetch(`http://localhost:3030/data/orders`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': userData.token
      },
      body: JSON.stringify(dataFurnitureBuy)
    })

    if (res.ok != true) {
      const error = await res.json()
      throw new Error(error.message)
    }


  } catch (error) {
    alert(error.message)

  }
  onLoad()
}

async function allFurnitures(){
  userId = userData.id
  const res = await fetch(`http://localhost:3030/data/orders`)

  const data = await res.json()
  const dataValues = data.filter(x=>x._ownerId==userId).map(x=>Object.values(x).splice(0,Object.values(x).length-3))
  const finalData = []
  for(let f of dataValues){
    for(let j of f){
      finalData.push(j)
    }
  }
  // console.log(finalData)
  // console.log(userId)
  const divEl = document.querySelector('div [class="orders"]')
  divEl.querySelectorAll('p span')[0].textContent = finalData.map(x=>x.name).join(', ')
  divEl.querySelectorAll('p span')[1].textContent = `${finalData.map(x=>x.price).reduce((a,p)=>a+Number(p),0)} $`

  
}

async function onLogout() {

  const res = await fetch(`http://localhost:3030/users/logout`, {
      method: 'get',

  })
  sessionStorage.clear()
  window.location = 'home.html'
}