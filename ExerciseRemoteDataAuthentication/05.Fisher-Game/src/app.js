let userData = null;

window.addEventListener('DOMContentLoaded', () => {
    const catchesEl = document.getElementById('catches')

    userData = JSON.parse(sessionStorage.getItem('userData'))
    if (userData != null) {
        document.getElementById('guest').style.display = 'none'
        document.querySelector('#addForm .add').disabled = false
        document.querySelector('.email span').textContent = userData.email

    } else {
        document.getElementById('user').style.display = 'none'
    }
    document.querySelector('.load').addEventListener('click', onLoad)

    document.getElementById('addForm').addEventListener('submit', createSubmit)
    document.getElementById('logout').addEventListener('click', onLogout)
    catchesEl.addEventListener('click', onDelete)
    catchesEl.addEventListener('click', onUpdate)


})

async function onLogout() {

    const res = await fetch(`http://localhost:3030/users/logout`, {
        method: 'get',

    })
    sessionStorage.clear()
    window.location = 'index.html'
}
async function createSubmit(e) {
    e.preventDefault()
    if (!userData) {
        window.location = 'login.html'
        return
    }
    const formData = new FormData(e.target)

    const data = [...formData.entries()].reduce((a, [k, v]) => Object.assign(a, { [k]: v }), {})
    try {

        if (Object.values(data).some(x => x == '')) {
            throw new Error('All fields are requered')
        }
        const res = await fetch(`http://localhost:3030/data/catches`, {
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
        onLoad()


    } catch (error) {
        alert(error.message)

    }
}

async function onLoad() {
    const res = await fetch('http://localhost:3030/data/catches')

    const data = await res.json()
    document.getElementById('catches').replaceChildren(...data.map(createPteview))
}

function createPteview(data) {
    const isOwner = (userData && data._ownerId == userData.id)

    const divEl = document.createElement('div')
    divEl.className = 'catch'
    divEl.innerHTML = `
        <label>Angler</label>
        <input type="text" class="angler" value="${data.angler}" ${!isOwner ? 'disabled' : ''}>
        <label>Weight</label>
        <input type="text" class="weight" value="${data.weight}" ${!isOwner ? 'disabled' : ''}>
        <label>Species</label>
        <input type="text" class="species" value="${data.species}" ${!isOwner ? 'disabled' : ''}>
        <label>Location</label>
        <input type="text" class="location" value="${data.location}" ${!isOwner ? 'disabled' : ''}>
        <label>Bait</label>
        <input type="text" class="bait" value="${data.bait}" ${!isOwner ? 'disabled' : ''}>
        <label>Capture Time</label>
        <input type="number" class="captureTime" value="${data.captureTime}" ${!isOwner ? 'disabled' : ''}>
        <button class="update" data-id="${data._id}" ${!isOwner ? 'disabled' : ''}>Update</button>
        <button class="delete" data-id="${data._id}" ${!isOwner ? 'disabled' : ''}>Delete</button>
    `
    return divEl
}

async function onDelete(e){
    if (e.target.textContent == 'Delete'){
        
        const id = e.target.dataset.id
      

        const url = `http://localhost:3030/data/catches/` + id
        const res = await fetch(url,{
            method:'delete',
            headers: { 'Content-Type': 'application/json',
            'X-Authorization': userData.token }
        })
        onLoad()
    }
}

async function onUpdate(e){
    if (e.target.textContent == 'Update'){
        
        const id = e.target.dataset.id
       

        const url = `http://localhost:3030/data/catches/` + id
        const divEl = e.target.parentElement
        
        const catcheData = [...divEl.querySelectorAll('input')].reduce((a, b) => Object.assign(a, { [b.className]: b.value }), {})
           
        const res = await fetch(url,{
            method:'put',
            headers: { 'Content-Type': 'application/json',
            'X-Authorization': userData.token },
            body: JSON.stringify(catcheData)

        })
        onLoad()
    }
}


