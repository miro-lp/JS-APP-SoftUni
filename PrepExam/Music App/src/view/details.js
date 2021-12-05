
import { editItem, getItemById, deleteItem} from "../api/data.js"
import { html, until } from "../lib.js"
import { createSubmitHandler, getUserData } from "../util.js"

let data = {}

const detailsTemplate = (promisMusic) => html`
<section id="detailsPage">

    ${until(promisMusic, html`<p class="spinner">Loading &hellip;</p>`)}

</section>
`


const card = (onDelete, data, userData) => html`
<div class="wrapper">
    <div class="albumCover">
        <img src=${data.imgUrl}>
    </div>
    <div class="albumInfo">
        <div class="albumText">

            <h1>Name: ${data.name}</h1>
            <h3>Artist: ${data.artist}</h3>
            <h4>Genre: ${data.genre}</h4>
            <h4>Price: $${data.price}</h4>
            <h4>Date: ${data.releaseDate}</h4>
            <p>Description: ${data.description}</p>
        </div>

        <!-- Only for registered user and creator of the album-->

        ${data._ownerId == userData.id ? html`<div class="actionBtn"> <a class="edit" href=${'/edit/' +
        data._id}>Edit</a>
            <a @click="${onDelete}" id="deleteBtn" class="remove" href="javascript:void(0)">Delete</a> </div>` : null}

    </div>
</div>

`

export function detailsPage(ctx) {

    ctx.render(detailsTemplate(detailsItem(ctx.params.id, () => onDelete(ctx.params.id))))

    async function onDelete(id) {
        await deleteItem(id)
        ctx.page.redirect('/dashboard')

    }

}

async function detailsItem(id, onDelete) {
    let userData = getUserData()
    if (!userData) {
        userData = {}
        userData.id = ''
    }
    const meme = await getItemById(id)

    data = meme
    return card(onDelete, meme, userData)
}


const editTemplate = (onSubmit, errorMsg, data) => html`
<section class="editPage">
    ${errorMsg ? html` <section id="notifications">
        <div id="errorBox" class="notification">
            <span>${errorMsg}</span>
        </div>
    </section>`: null}

    <form @submit="${onSubmit}">
        <fieldset>
            <legend>Edit Album</legend>

            <div class="container">
                <label for="name" class="vhide">Album name</label>
                <input id="name" name="name" class="name" type="text" .value=${data.name == undefined ? '' : data.name}>

                <label for="imgUrl" class="vhide">Image Url</label>
                <input id="imgUrl" name="imgUrl" class="imgUrl" type="text" .value=${data.imgUrl == undefined ? '' :
                    data.imgUrl}>

                <label for="price" class="vhide">Price</label>
                <input id="price" name="price" class="price" type="text" .value=${data.price == undefined ? '' :
                    data.price}>

                <label for="releaseDate" class="vhide">Release date</label>
                <input id="releaseDate" name="releaseDate" class="releaseDate" type="text"
                    .value=${data.releaseDate == undefined ? '' : data.releaseDate}>

                <label for="artist" class="vhide">Artist</label>
                <input id="artist" name="artist" class="artist" type="text" .value=${data.artist == undefined ? '' :
                    data.artist}>

                <label for="genre" class="vhide">Genre</label>
                <input id="genre" name="genre" class="genre" type="text" .value=${data.genre == undefined ? '' :
                    data.genre}>

                <label for="description" class="vhide">Description</label>
                <textarea name="description" class="description" rows="10" cols="10"
                    .value=${data.description == undefined ? '' : data.description}></textarea>

                <button class="edit-album" type="submit">Edit Album</button>
            </div>
        </fieldset>
    </form>
</section>

`


export function editPage(ctx) {

    update('', data)

    function update(errorMsg = '', data) {
        ctx.render(editTemplate(createSubmitHandler(onSubmit, 'name', 'imgUrl', 'price', 'releaseDate', 'artist', 'genre', 'description'), errorMsg, data))
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
