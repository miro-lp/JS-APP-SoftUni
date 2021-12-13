import { getTopicById } from "../api/data.js"
import { html, until } from "../lib.js"

const detailsTemplate = (detailsPromis) => html`
<div class="narrow center">
    ${until(detailsPromis, html`<p class="spinner">Loading &hellip;</p>`)}
</div>
`
const topicCard = (topic) => html`
<header>${topic.title}</header>
<p>${topic.content}</p>

`
export function detailsPage(ctx) {
    ctx.render(detailsTemplate(loadDetails(ctx.params.id)))

}

async function loadDetails(id) {
    const result = await getTopicById(id)

    return topicCard(result)
}