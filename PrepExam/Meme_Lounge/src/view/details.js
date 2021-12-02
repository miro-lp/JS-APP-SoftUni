
import { editMeme, getMemeById, deleteMeme } from "../api/data.js"
import { html, until } from "../lib.js"
import { createSubmitHandler, getUserData } from "../util.js"

let data = {}

const detailsTemplate = (promisMeme) => html`
<section id="meme-details">

    ${until(promisMeme, html`<p class="spinner">Loading &hellip;</p>`)}

</section>
`

const memeCard = (onDelete, data, userData) => html`
        <h1>Meme Title: ${data.title}
        
        </h1>
        <div class="meme-details">
            <div class="meme-img">
                <img alt="meme-alt" src=${data.imageUrl}>
            </div>
            <div class="meme-description">
                <h2>Meme Description</h2>
                <p>
                    ${data.description}
                </p>
        
                <!-- Buttons Edit/Delete should be displayed only for creator of this meme  -->
                ${data._ownerId == userData.id ? html` <a class="button warning" href=${'/edit/' + data._id}>Edit</a>
                <button @click="${onDelete}" id="deleteBtn" class="button danger">Delete</button>` : null}
        
        
            </div>
        </div>
`
export function detailsPage(ctx) {

    ctx.render(detailsTemplate(detailsMeme(ctx.params.id, ()=>onDelete(ctx.params.id))))


    async function onDelete(id) {
        await deleteMeme(id)
        ctx.page.redirect('/all-memes')

    }

}

async function detailsMeme(id, onDelete) {
    let userData = getUserData()
    if(!userData){
        console.log(userData)
        userData = {}
        userData.id =''
        console.log(userData)
    }

    let meme = await getMemeById(id)
    data = meme
    return memeCard(onDelete, meme, userData)
}


const editTemplate = (onSubmit, errorMsg, data) => html`
<section id="edit-meme">
    ${errorMsg ? html` <section id="notifications">
        <div id="errorBox" class="notification">
            <span>${errorMsg}</span>
        </div>
    </section>`: null}

    <form @submit="${onSubmit}" id="edit-form">
        <h1>Edit Meme</h1>
        <div class="container">
            <label for="title">Title</label>
            <input id="title" type="text" placeholder="Enter Title" name="title" .value=${data.title}>
            <label for="description">Description</label>
            <textarea id="description" placeholder="Enter Description" name="description" .value=${data.description}>
                        </textarea>
            <label for="imageUrl">Image Url</label>
            <input id="imageUrl" type="text" placeholder="Enter Meme ImageUrl" name="imageUrl" .value=${data.imageUrl}>
            <input type="submit" class="registerbtn button" value="Edit Meme">
        </div>
    </form>

</section>
`



export function editPage(ctx) {

    update('', data)

    function update(errorMsg = '', data) {
        ctx.render(editTemplate(createSubmitHandler(onSubmit, 'title', 'description', 'imageUrl'), errorMsg, data))
    }

    async function onSubmit(data) {
        console.log(data)

        try {
            const missing = Object.entries(data).filter(([k, v]) => v == '')
            if (missing.length > 0) {
                const errors = missing.reduce((a, [k, v]) => Object.assign(a, { [k]: true }), {})
                throw {
                    error: new Error('All fields are required!'),
                    errors
                }
            }
            await editMeme(ctx.params.id, data)
            ctx.page.redirect('/details/' + ctx.params.id)
        }
        catch (err) {
            const message = err.message || err.error.message
            update(message, data)
        }
    }
}
