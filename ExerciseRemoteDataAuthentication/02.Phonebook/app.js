function attachEvents() {
    document.getElementById('btnLoad').addEventListener('click', loadContacts)
    document.getElementById('btnCreate').addEventListener('click', onCreate)

    list.addEventListener('click', onDelete)
}
const list = document.getElementById('phonebook')
const persontInput = document.getElementById('person')
const phoneInput = document.getElementById('phone')


attachEvents();

async function onDelete(event) {
    const id = event.target.dataset.id
    if (id != undefined) {
        await deleteContact(id)
        event.target.parentElement.remove()
    }

}

async function onCreate() {
    const person = persontInput.value
    const phone = phoneInput.value
    const result = await createContacts({ person, phone })
    list.appendChild(createElement(result))


}

async function loadContacts() {
    const res = await fetch(`http://localhost:3030/jsonstore/phonebook`)
    const data = await res.json()

    list.replaceChildren(...Object.values(data).map(createElement))
}

function createElement(contact) {
    const liElement = document.createElement('li')
    liElement.innerHTML = `${contact.person}: ${contact.phone} <button data-id = ${contact._id}>Delete</button>`
    return liElement
}


async function createContacts(contact) {
    const res = await fetch(`http://localhost:3030/jsonstore/phonebook`,
        {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contact)
        })
    const data = await res.json()

    return data
}

async function deleteContact(id) {
    const res = await fetch(`http://localhost:3030/jsonstore/phonebook/` + id,
        {
            method: 'delete'
        })
    const data = await res.json()

    return data
}