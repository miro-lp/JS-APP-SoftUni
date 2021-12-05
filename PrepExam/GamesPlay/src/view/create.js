
import { createItem } from "../api/data.js"
import { html } from "../lib.js"
import { createSubmitHandler, getUserData } from "../util.js"


const createTemplate = (onSubmit, errorMsg, data) => html`
        <section id="create-page" class="auth">
            ${errorMsg ? html` <section id="notifications">
                <div id="errorBox" class="notification">
                    <span>${errorMsg}</span>
                </div>
            </section>`: null}
            <form @submit="${onSubmit}" id="create">
                <div class="container">
        
                    <h1>Create Game</h1>
                    <label for="leg-title">Legendary title:</label>
                    <input type="text" id="title" name="title" placeholder="Enter game title..." .value=${data.title==undefined ? '' :
        data.title}>
        
                    <label for="category">Category:</label>
                    <input type="text" id="category" name="category" placeholder="Enter game category..." .value=${data.category==undefined ? '' :
        data.category}>
        
                    <label for="levels">MaxLevel:</label>
                    <input type="number" id="maxLevel" name="maxLevel" min="1" placeholder="1" .value=${data.maxLevel==undefined
                        ? '' : data.maxLevel}>
        
                    <label for="game-img">Image:</label>
                    <input type="text" id="imageUrl" name="imageUrl" placeholder="Upload a photo..." .value=${data.imageUrl==undefined
                        ? '' : data.imageUrl}>
        
                    <label for="summary">Summary:</label>
                    <textarea name="summary" id="summary" .value=${data.summary==undefined
                        ? '' : data.summary}></textarea>
                    <input class="btn submit" type="submit" value="Create Game">
                </div>
            </form>
        </section>`


export function createPage(ctx) {

    update()

    function update(errorMsg = '', data = {}) {
        ctx.render(createTemplate(createSubmitHandler(onSubmit, 'title', 'category', 'maxLevel', 'imageUrl', 'summary'), errorMsg, data))
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

            await createItem(data)
            ctx.page.redirect('/')
        }
        catch (err) {
            const message = err.message || err.error.message
            update(message, data)
        }
    }
}
