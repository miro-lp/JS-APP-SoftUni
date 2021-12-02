
import { getAllMemes } from "../api/data.js"
import { html, until } from "../lib.js"

const allMemesTemplate = (promisMemes) => html`<section id="meme-feed">
    <h1>All Memes</h1>
    <div id="memes">
        <!-- Display : All memes in database ( If any ) -->
        ${until(promisMemes, html`<p class="spinner">Loading &hellip;</p>`)}
        <!-- Display : If there are no memes in database -->
       

    </div>
</section>
`

const memeCard = (data) => html`

<div class="meme">
    <div class="card">
        <div class="info">
            <p class="meme-title">${data.title}</p>
            <img class="meme-image" alt="meme-img" src="${data.imageUrl}">
        </div>
        <div id="data-buttons">
            <a class="button" href=${'/details/' + data._id}>Details</a>
        </div>
    </div>
</div>
`
export function allMemesPage(ctx) {
    ctx.render(allMemesTemplate(allMemes()))

}

async function allMemes() {
    let memes = await getAllMemes()
    
    if (memes.length == 0){
        return html`<p class="no-memes">No memes in database.</p>`
    }
    return memes.map(memeCard)
}
