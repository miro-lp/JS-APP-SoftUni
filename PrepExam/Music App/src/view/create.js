
import { createItem } from "../api/data.js"
import { html } from "../lib.js"
import { createSubmitHandler, getUserData } from "../util.js"


const createTemplate = (onSubmit, errorMsg, data) => html`     
        <section class="createPage">
        ${errorMsg ? html` <section id="notifications">
                <div id="errorBox" class="notification">
                    <span>${errorMsg}</span>
                </div>
            </section>`: null}
            <form @submit="${onSubmit}">
                <fieldset>
                    <legend>Add Album</legend>

                    <div class="container">
                        <label for="name" class="vhide">Album name</label>
                        <input id="name" name="name" class="name" type="text" placeholder="Album name" .value=${data.name==undefined
                        ? '' : data.name}>

                        <label for="imgUrl" class="vhide">Image Url</label>
                        <input id="imgUrl" name="imgUrl" class="imgUrl" type="text" placeholder="Image Url" .value=${data.imgUrl==undefined
                        ? '' : data.imgUrl}>

                        <label for="price" class="vhide">Price</label>
                        <input id="price" name="price" class="price" type="text" placeholder="Price" .value=${data.price==undefined
                        ? '' : data.price}>

                        <label for="releaseDate" class="vhide">Release date</label>
                        <input id="releaseDate" name="releaseDate" class="releaseDate" type="text" placeholder="Release date" .value=${data.releaseDate==undefined
                        ? '' : data.releaseDate}>

                        <label for="artist" class="vhide">Artist</label>
                        <input id="artist" name="artist" class="artist" type="text" placeholder="Artist" .value=${data.artist==undefined
                        ? '' : data.artist}>

                        <label for="genre" class="vhide">Genre</label>
                        <input id="genre" name="genre" class="genre" type="text" placeholder="Genre" .value=${data.genre==undefined
                        ? '' : data.genre}>

                        <label for="description" class="vhide">Description</label>
                        <textarea name="description" class="description" placeholder="Description" .value=${data.description==undefined
                        ? '' : data.description}></textarea>

                        <button class="add-album" type="submit">Add New Album</button>
                    </div>
                </fieldset>
            </form>
        </section>
        
        `


export function createPage(ctx) {

    update()

    function update(errorMsg = '', data = {}) {
        ctx.render(createTemplate(createSubmitHandler(onSubmit, 'name', 'imgUrl', 'price', 'releaseDate', 'artist', 'genre', 'description'), errorMsg, data))
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
