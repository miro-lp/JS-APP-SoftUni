
import { getAllItems } from "../api/data.js"
import { html, until } from "../lib.js"

const allItemsTemplate = (promisBooks) => html`
<section id="catalog-page">
    <h1>All Games</h1>

    ${until(promisBooks, html`<p class="spinner">Loading &hellip;</p>`)}

</section>
`

const card = (data) => html`
            <div class="allGames">
                <div class="allGames-info">
                    <img src=${data.imageUrl}>
                    <h6>${data.category}</h6>
                    <h2>${data.title}</h2>
                    <a href=${'/details/' + data._id} class="details-button">Details</a>
                </div>
            </div>
`

export function allItmesPage(ctx) {
    ctx.render(allItemsTemplate(allItems()))
}

async function allItems() {
    let items = await getAllItems()

    if (items.length == 0) {
        return html`<h3 class="no-articles">No articles yet</h3>`
    }
    return items.map(card)
}
