import { getTopicCount } from "../api/data.js"
import { html, until } from "../lib.js"

const homeTemplate = (countPromis) => html`
<h1>Scripters Home</h1>
<div class="splash">
    <p>Welcome to Scripters forum</p>
    <div><a href="/topics">User ${until(countPromis, 'topics')}</a></div>

</div>
`
export function homePage(ctx){
    ctx.render(homeTemplate(loadHome()))

}

async function loadHome(){
    const result = await getTopicCount()

    return `${result} topics`
}