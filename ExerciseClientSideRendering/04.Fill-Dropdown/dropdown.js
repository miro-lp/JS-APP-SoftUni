import { html, render } from './node_modules/lit-html/lit-html.js'

const root = document.querySelector('div')

const selectTemplate = (data) => html`
<select id="menu">${data.map(x => html`<option value="${x._id}">${x.text}</option>`)}</select>
`

function update(data) {
    render(selectTemplate(data), root)
}



async function getData() {
    const res = await fetch(`http://localhost:3030/jsonstore/advanced/dropdown`)
    const data = await res.json()
    const cities = Object.values(data)

    update(cities)
}

const form = document.querySelector('form')
form.addEventListener('submit', onPost)
getData()

async function onPost(e) {
    e.preventDefault()
    const addName = document.getElementById('itemText').value.trim()

    if (addName) {
        const res = await fetch(`http://localhost:3030/jsonstore/advanced/dropdown`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: addName })
        })

        if (res.ok == true) {
            form.reset()
            getData()
        }

    }

}