
import { editItem, getItemById, deleteItem, getComments, postComment } from "../api/data.js"
import { html, until } from "../lib.js"
import { createSubmitHandler, getUserData } from "../util.js"

let data = {}


const detailsTemplate = (promisMeme) => html`
<section id="game-details">
    <h1>Game Details</h1>

    ${until(promisMeme, html`<p class="spinner">Loading &hellip;</p>`)}



</section>
`


const card = (onDelete, data, userData, comments, createComment) => html`
<div class="info-section">

    <div class="book-description">
        <h3>Description:</h3>
        <p>${data.description}</p>
    </div>

    <div class="game-header">
        <img class="game-img" src=${data.imageUrl} />
        <h1>${data.title}</h1>
        <span class="levels">MaxLevel: ${data.maxLevel}</span>
        <p class="type">${data.category}</p>
    </div>

    <p class="text"> ${data.summary} </p>

    <div class="details-comments">
        <h2>Comments:</h2>
        <ul>
        ${comments.length == 0 ? html`<p class="no-comment">No comments.</p>` : 
    comments.map(c=>html`<li class="comment">
                <p>Content: ${c.comment}</p>
            </li>`)}    
        </ul>
    </div>
  <!-- Edit/Delete buttons ( Only for creator of this game )  -->
    ${data._ownerId == userData.id ? html`<div class="buttons"> <a class="button" href=${'/edit/' + data._id}>Edit</a>
        <a @click="${onDelete}" id="deleteBtn" class="button" href="javascript:void(0)">Delete</a> </div>` : null}

</div>

${userData.id == '' || data._ownerId == userData.id ? null : html`<article class="create-comment">
    <label>Add new comment:</label>
    <form @submit="${createComment}" class="form">
        <textarea name="comment" placeholder="Comment......"></textarea>
        <input class="btn submit" type="submit" value="Add Comment">
    </form>
</article>` }

`


export function detailsPage(ctx) {

    async function createComment(e, id) {
        e.preventDefault()
        let result;
        const formData = new FormData(e.target)
        const comment = formData.get('comment').trim()
       
        try{
            if(comment.length >0){
                 result = {gameId: id, comment}
                }else{
                    throw new Error('Empty comment')
                }
            
            await postComment(result)
            ctx.page.redirect('/details/' + id)

        }catch(err){
            
        }

    }

    ctx.render(detailsTemplate(detailsItem(ctx.params.id, () => onDelete(ctx.params.id), (e) => createComment(e, ctx.params.id))))

    async function onDelete(id) {
        await deleteItem(id)
        ctx.page.redirect('/dashboard')

    }

}

async function detailsItem(id, onDelete, createComment) {
    let userData = getUserData()
    if (!userData) {
        userData = {}
        userData.id = ''
    }
    const [comments, meme] = await Promise.all([getComments(id), getItemById(id)])
    
    data = meme
    return card(onDelete, meme, userData, comments, createComment)
}


const editTemplate = (onSubmit, errorMsg, data) => html`
<section id="edit-page" class="auth">
    ${errorMsg ? html` <section id="notifications">
        <div id="errorBox" class="notification">
            <span>${errorMsg}</span>
        </div>
    </section>`: null}
    <form @submit="${onSubmit}" id="edit">
        <div class="container">

            <h1>Edit Game</h1>
            <label for="leg-title">Legendary title:</label>
            <input type="text" id="title" name="title" .value=${data.title}>

            <label for="category">Category:</label>
            <input type="text" id="category" name="category" .value=${data.category}>

            <label for="levels">MaxLevel:</label>
            <input type="number" id="maxLevel" name="maxLevel" min="1" .value=${data.maxLevel}>

            <label for="game-img">Image:</label>
            <input type="text" id="imageUrl" name="imageUrl" .value=${data.imageUrl}>

            <label for="summary">Summary:</label>
            <textarea name="summary" id="summary" .value=${data.summary}></textarea>
            <input class="btn submit" type="submit" value="Edit Game">

        </div>
    </form>
</section>
`


export function editPage(ctx) {

    update('', data)

    function update(errorMsg = '', data) {
        ctx.render(editTemplate(createSubmitHandler(onSubmit, 'title', 'category', 'maxLevel', 'imageUrl', 'summary'), errorMsg, data))
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
