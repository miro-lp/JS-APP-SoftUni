import { getAllTopics } from "../api/data.js"
import { html, until } from "../lib.js"

const topicTemplate = (topicPromise) => html`
<h1>Topics</h1>
<div>
    ${until(topicPromise, html`<p class="spinner">Loading &hellip;</p>`)}
   
`
export function topicPage(ctx) {
    ctx.render(topicTemplate(loadTopics()))

}
const topicArticle = (topic) => html`
<article class="preview">
    <header><a href="${'/topics/'+ topic._id}">${topic.title}</a></header>
    <div>Comments: 15</div>
</article>
`

async function loadTopics(){
    const topics = await getAllTopics()
    return topics.map(topicArticle)
}