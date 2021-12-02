
import { getAllItems } from "../api/data.js"
import { html, until } from "../lib.js"

const allBooksTemplate = (promisBooks) => html`
<section id="dashboard-page" class="dashboard">
    <h1>Dashboard</h1>

    <!-- Display ul: with list-items for All books (If any) -->
    <ul class="other-books-list">
        ${until(promisBooks, html`<p class="spinner">Loading &hellip;</p>`)}

    </ul>

    <!-- Display paragraph: If there are no books in the database -->

</section>`

const bookCard = (data) => html`

<li class="otherBooks">
    <h3>${data.title}</h3>
    <p>Type: ${data.type}</p>
    <p class="img"><img src=${data.imageUrl}></p>
    <a class="button" href=${'/details/' + data._id}>Details</a>
</li>
`
export function allItmesPage(ctx) {
    ctx.render(allBooksTemplate(allBooks()))

}

async function allBooks() {
    let books = await getAllItems()

    if (books.length == 0) {
        return html`<p class="no-books">No books in database!</p>`
    }
    return books.map(bookCard)
}
