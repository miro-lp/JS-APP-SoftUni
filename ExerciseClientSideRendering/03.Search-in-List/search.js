import { html, render } from './node_modules/lit-html/lit-html.js'
import { towns as townsName } from './towns.js'


const root = document.getElementById('towns')
const towns = townsName.map(t => ({ name: t, info: false }))

const template = (towns) => html`
<ul>
   ${towns.map(town => html`<li class="${town.info ? 'active' : ''}">${town.name}</li>`)}

</ul>
`

function renderUpdate() {
   render(template(towns), root)

}
renderUpdate()

const search = document.getElementById('searchText')
const result = document.getElementById('result')

document.querySelector('button').addEventListener('click', () => {

   const match = search.value.trim().toLocaleLowerCase()
   let counter = 0
   for (let t of towns) {
      if (match && t.name.toLocaleLowerCase().includes(match)) {
         t.info = true
         counter += 1
      } else {
         t.info = false
      }
   }
   result.textContent = `${counter} matches found`
   renderUpdate()
})