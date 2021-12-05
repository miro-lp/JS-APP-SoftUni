import { getAllItemsHome } from "../api/data.js"
import { html, until } from "../lib.js"

const allItemsTemplate = (promisBooks) => html`
<section id="welcome-world">

    <div class="welcome-message">
        <h2>ALL new games are</h2>
        <h3>Only in GamesPlay</h3>
    </div>
    <img src="./images/four_slider_img01.png" alt="hero">

    <div id="home-page">
        <h1>Latest Games</h1>

        ${until(promisBooks, html`<p class="spinner">Loading &hellip;</p>`)}

    </div>
</section>
`

const card = (data) => html`
            <div class="game">
                <div class="image-wrap">
                    <img src=${data.imageUrl}>
                </div>
                <h3>${data.title}</h3>
                <div class="rating">
                    <span>☆</span><span>☆</span><span>☆</span><span>☆</span><span>☆</span>
                </div>
                <div class="data-buttons">
                    <a href=${'/details/' + data._id} class="btn details-btn">Details</a>
                </div>
            </div>
`

export function homePage(ctx) {
    ctx.render(allItemsTemplate(allItems()))
}

async function allItems() {
    let items = await getAllItemsHome()
    
    
    if (items.length == 0) {
        return html`<h3 class="no-articles">No games yet</h3>`
    }
    return items.map(card)
}
