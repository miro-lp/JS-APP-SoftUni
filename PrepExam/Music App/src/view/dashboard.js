
import { getAllItems } from "../api/data.js"
import { html, until } from "../lib.js"
import { getUserData } from "../util.js"

const allItemsTemplate = (promisBooks) => html`
<section id="catalogPage">
    <h1>All Albums</h1>

    ${until(promisBooks, html`<p class="spinner">Loading &hellip;</p>`)}

</section>
`

const card = (data, userData) => html`
            <div class="card-box">
                <img src=${data.imgUrl}>
                <div>
                    <div class="text-center">
                        <p class="name">Name: ${data.name}</p>
                        <p class="artist">Artist: ${data.artist}</p>
                        <p class="genre">Genre: ${data.genre}</p>
                        <p class="price">Price: $${data.price}</p>
                        <p class="date">Release Date: ${data.releaseDate}</p>
                    </div>
            
                    ${userData ? html` <div class="btn-group">
                        <a href=${'/details/' + data._id} id="details">Details</a>
                    </div>` : null}
            
                </div>
            </div>

`

export function allItmesPage(ctx) {
    ctx.render(allItemsTemplate(allItems()))
}

async function allItems() {
    let userData = getUserData()
    let items = await getAllItems()
    let itemsUser = items.map(x => [x, userData])
   
    if (items.length == 0) {
        return html`<p>No Albums in Catalog!</p>`
    }
    return itemsUser.map(([d, u]) => card(d, u))
}
