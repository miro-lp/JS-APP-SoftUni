import { html, render } from "./node_modules/lit-html/lit-html.js";


const root = document.querySelector('tbody')

const tableTemplate = (student) => html`
<tr class="${student.match ? 'select' : ''}">
   <td>${student.firstName} ${student.lastName} </td>
   <td>${student.email}</td>
   <td>${student.course}</td>
</tr>
`
let data;
getData()


async function getData() {
   const res = await fetch('http://localhost:3030/jsonstore/advanced/table')

   data = Object.values(await res.json())
   data.forEach(s => s.match = false)
   update()

}

function update() {
   render(data.map(c => tableTemplate(c)), root)

}

const input = document.getElementById('searchField')

document.getElementById('searchBtn').addEventListener('click', findMatch)

function findMatch() {
   const match = input.value.trim().toLocaleLowerCase()
   for (let s of data) {
      if (Object.values(s).slice(0, 4).some(x =>match && x.toLocaleLowerCase().includes(match) == true)) {
         s.match = true
      } else {
         s.match = false

      }
   }
   update()

}


