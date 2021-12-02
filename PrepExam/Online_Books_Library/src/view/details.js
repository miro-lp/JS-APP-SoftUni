
import { editItem, getItemById, deleteItem, getLikesCount, getIsLiked, createLike } from "../api/data.js"
import { html, until } from "../lib.js"
import { createSubmitHandler, getUserData } from "../util.js"

let data = {}

const detailsTemplate = (promisMeme) => html`
<section id="details-page" class="details">
    ${until(promisMeme, html`<p class="spinner">Loading &hellip;</p>`)}

</section>`


const card = (onDelete, data, userData, countLikes, onLike, isLiked) => html`

        <div class="book-information">
            <h3> ${data.title}</h3>
            <p class="type">Type: ${data.type}</p>
            <p class="img"><img src=${data.imageUrl}></p>
            <div class="actions">
                <!-- Edit/Delete buttons ( Only for creator of this book )  -->
                ${data._ownerId == userData.id ? html` <a class="button" href=${'/edit/' + data._id}>Edit</a>
                <a @click="${onDelete}" id="deleteBtn" class="button" href="javascript:void(0)">Delete</a>` : null}
        
                    <!-- Bonus -->
                    <!-- Like button ( Only for logged-in users, which is not creators of the current book ) -->
        
                    ${userData.id != '' && data._ownerId != userData.id && isLiked==0 ? html`<a @click="${onLike}" id="likeBtn" class="button" href="javascript:void(0)">Like</a>` : null}
        
                    <!-- ( for Guests and Users )  -->
                    <div class="likes">
                        <img class="hearts" src="/images/heart.png">
                        <span id="total-likes">Likes: ${countLikes}</span>
                    </div>
                    <!-- Bonus -->
            </div>
        </div>
        <div class="book-description">
            <h3>Description:</h3>
            <p>${data.description}</p>
        </div>
`


export function detailsPage(ctx) {
    async function onLike(id) {
        await createLike({bookId:id})
        ctx.page.redirect('/details/' + id)

    }
    
    ctx.render(detailsTemplate(detailsItem(ctx.params.id, () => onDelete(ctx.params.id),  () => onLike(ctx.params.id))))

    

    async function onDelete(id) {
        await deleteItem(id)
        ctx.page.redirect('/dashboard')

    }

    

}

async function detailsItem(id, onDelete, onLike) {
    let isLiked = 0
    let userData = getUserData()
    if (!userData) {
        userData = {}
        userData.id = ''
    }else{
        isLiked = await getIsLiked(id, userData.id)
    }
    const [countLikes,meme]= await Promise.all([getLikesCount(id),getItemById(id)])
    
    data = meme
    return card(onDelete, meme, userData, countLikes, onLike, isLiked)
}


const editTemplate = (onSubmit, errorMsg, data) => html`

<section id="edit-page" class="edit">
    ${errorMsg ? html` <section id="notifications">
        <div id="errorBox" class="notification">
            <span>${errorMsg}</span>
        </div>
    </section>`: null}
    <form @submit="${onSubmit}" id="edit-form" action="#" method="">
        <fieldset>
            <legend>Edit my Book</legend>
            <p class="field">
                <label for="title">Title</label>
                <span class="input">
                    <input type="text" name="title" id="title" .value=${data.title}>
                </span>
            </p>
            <p class="field">
                <label for="description">Description</label>
                <span class="input">
                    <textarea name="description" id="description" .value=${data.description}></textarea>
                </span>
            </p>
            <p class="field">
                <label for="image">Image</label>
                <span class="input">
                    <input type="text" name="imageUrl" id="image"  .value=${data.imageUrl}>
                </span>
            </p>
            <p class="field">
                <label for="type">Type</label>
                <span class="input">
                    <select id="type" name="type"  .value=${data.type}>
                        <option value="Fiction" selected>Fiction</option>
                        <option value="Romance">Romance</option>
                        <option value="Mistery">Mistery</option>
                        <option value="Classic">Clasic</option>
                        <option value="Other">Other</option>
                    </select>
                </span>
            </p>
            <input class="button submit" type="submit" value="Save">
        </fieldset>
    </form>
</section>
`


export function editPage(ctx) {

    update('', data)

    function update(errorMsg = '', data) {
        ctx.render(editTemplate(createSubmitHandler(onSubmit, 'title', 'description', 'imageUrl', 'type'), errorMsg, data))
    }


    async function onSubmit(data) {
        

        try {
            const missing = Object.entries(data).filter(([k, v]) => v == '')
            if (missing.length > 0) {
                const errors = missing.reduce((a, [k, v]) => Object.assign(a, { [k]: true }), {})
                throw {
                    error: new Error('All fields are required!'),
                    errors
                }
            }
            await editItem(ctx.params.id, data)
            ctx.page.redirect('/details/' + ctx.params.id)
        }
        catch (err) {
            const message = err.message || err.error.message
            update(message, data)
        }
    }
}
