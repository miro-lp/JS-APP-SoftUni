
import { createItem } from "../api/data.js"
import { html } from "../lib.js"
import { createSubmitHandler, getUserData } from "../util.js"


const createTemplate = (onSubmit, errorMsg, data) => html`
<section id="create-page" class="create">
    ${errorMsg ? html` <section id="notifications">
        <div id="errorBox" class="notification">
            <span>${errorMsg}</span>
        </div>
    </section>`: null}
    <form @submit="${onSubmit}" id="create-form" action="" method="">
        <fieldset>
            <legend>Add new Book</legend>
            <p class="field">
                <label for="title">Title</label>
                <span class="input">
                    <input type="text" name="title" id="title" placeholder="Title" .value=${data.title == undefined ? '' :
                        data.title}>
                </span>
            </p>
            <p class="field">
                <label for="description">Description</label>
                <span class="input">
                    <textarea name="description" id="description" placeholder="Description" .value=${data.description == undefined ? '' : data.description}></textarea>
                </span>
            </p>
            <p class="field">
                <label for="image">Image</label>
                <span class="input">
                    <input type="text" name="imageUrl" id="image" placeholder="Image" .value=${data.imageUrl == undefined ? '' : data.imageUrl}>
                </span>
            </p>
            <p class="field">
                <label for="type">Type</label>
                <span class="input">
                    <select id="type" name="type" .value=${data.type == undefined ? '' : data.type}>
                        <option value="Fiction">Fiction</option>
                        <option value="Romance">Romance</option>
                        <option value="Mistery">Mistery</option>
                        <option value="Classic">Clasic</option>
                        <option value="Other">Other</option>
                    </select>
                </span>
            </p>
            <input class="button submit" type="submit" value="Add Book">
        </fieldset>
    </form>
</section>`


export function createPage(ctx) {

    update()

    function update(errorMsg = '', data = {}) {
        ctx.render(createTemplate(createSubmitHandler(onSubmit, 'title', 'description', 'imageUrl', 'type'), errorMsg, data))
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
            ctx.page.redirect('/dashboard')
        }
        catch (err) {
            const message = err.message || err.error.message
            update(message, data)
        }
    }
}
