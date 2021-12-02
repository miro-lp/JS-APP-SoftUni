
import { editMeme, getMemeById, deleteMeme, createMeme } from "../api/data.js"
import { html } from "../lib.js"
import { createSubmitHandler, getUserData } from "../util.js"


const createTemplate = (onSubmit, errorMsg, data) => html`
        <section id="create-meme">
            ${errorMsg ? html` <section id="notifications">
                <div id="errorBox" class="notification">
                    <span>${errorMsg}</span>
                </div>
            </section>`: null}
            <form @submit="${onSubmit}" id="create-form">
                <div class="container">
                    <h1>Create Meme</h1>
                    <label for="title">Title</label>
                    <input id="title" type="text" placeholder="Enter Title" name="title" .value=${data.title==undefined ? '' : data.title}>
                    <label for="description">Description</label>
                    <textarea id="description" placeholder="Enter Description" name="description" .value=${data.description==undefined ? '' : data.description}></textarea>
                    <label for="imageUrl">Meme Image</label>
                    <input id="imageUrl" type="text" placeholder="Enter meme ImageUrl" name="imageUrl" .value=${data.imageUrl==undefined ? '' : data.imageUrl}>
                    <input type="submit" class="registerbtn button" value="Create Meme">
                </div>
            </form>
        </section>
`



export function createPage(ctx) {

    update()

    function update(errorMsg = '', data={}) {
        ctx.render(createTemplate(createSubmitHandler(onSubmit, 'title', 'description', 'imageUrl'), errorMsg, data))
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

            await createMeme(data)
            ctx.page.redirect('/all-memes')
        }
        catch (err) {
            const message = err.message || err.error.message
            update(message, data)
        }
    }
}
