
import {  getMyItems } from "../api/data.js"
import { html, until } from "../lib.js"
import { getUserData } from "../util.js"

const allItemsTemplate = (promisBooks) => html`
<section id="my-books-page" class="my-books">
    <h1>My Books</h1>

    <ul class="my-books-list">
        ${until(promisBooks, html`<p class="spinner">Loading &hellip;</p>`)}

    </ul>


</section>`

const cardTemplate = (data) => html`

<li class="otherBooks">
    <h3>${data.title}</h3>
    <p>Type: ${data.type}</p>
    <p class="img"><img src=${data.imageUrl}></p>
    <a class="button" href=${'/details/' + data._id}>Details</a>
</li>
`


export function myItemsPage(ctx) {
    const id = getUserData().id
    ctx.render(allItemsTemplate(allBooks(id)))

}

async function allBooks(id) {
    let books = await getMyItems(id)

    if (books.length == 0) {
        return html`<p class="no-books">No books in database!</p>`
    }
    return books.map(cardTemplate)
}
