
import { getMyMemes } from "../api/data.js"
import { html, until } from "../lib.js"
import { getUserData } from "../util.js"

let memes = []

const profileTemplate = (promisMemes, userData, promisCount) => html`
        <section id="user-profile-page" class="user-profile">
            <article class="user-info">
                <img id="user-avatar-url" alt="user-profile" src="/images/female.png">
                <div class="user-content">
                    <p>Username: ${!userData.username? userData.email: userData.username}</p>
                    <p>Email: ${userData.email}</p>
                    ${until(promisCount, html`<p class="spinner">Loading &hellip;</p>`)}
                </div>
            </article>
            <h1 id="user-listings-title">User Memes</h1>
            <div class="user-meme-listings">
                <!-- Display : All created memes by this user (If any) -->
                ${until(promisMemes, html`<p class="spinner">Loading &hellip;</p>`)}
        
            </div>
        </section>
`

const memeCard = (data) => html`
                <div class="user-meme">
                    <p class="user-meme-title">${data.title}</p>
                    <img class="userProfileImage" alt="meme-img" src=${data.imageUrl}>
                    <a class="button" href=${'/details/' + data._id}>Details</a>
                </div>
`
export function profilePage(ctx) {
    const userData = getUserData()
    ctx.render(profileTemplate(allMemes(userData.id), userData, allMyMemes(userData.id)))

}

async function allMyMemes(id) {
    memes = await getMyMemes(id)
    return html`<p>My memes count: ${memes.length}</p>`
}

async function allMemes(id) {
    memes = await getMyMemes(id)
    

    if (memes.length == 0) {
        return html`<p class="no-memes">No memes in database.</p>`
    }
    return memes.map(memeCard)
}


