import { html, render } from "./node_modules/lit-html/lit-html.js"
import { getBooks, deleteByID, createBook, editBookByID } from "./api/data.js"
import {until} from "./node_modules/lit-html/directives/until.js"

const root = document.querySelector('body')


let data = [];

const tableTemplate = (data) => html`

<button @click="${getData}" id="loadBooks">LOAD ALL BOOKS</button>
<table>
    <thead>
        <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Action</th>
        </tr>
    </thead>
    <tbody>
        ${data.map(b => html` <tr>
            <td>${b.title}</td>
            <td>${b.author}</td>
            <td>
                <button @click="${() => editBook(b._id)}">Edit</button>
                <button @click="${() => deleteBook(b._id)}">Delete</button>
            </td>
        </tr>`)}
    </tbody>
</table>
`

const loadingTemplate = ()=>html`

<button id="loadBooks">LOAD ALL BOOKS</button>
<table>
    <thead>
        <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Action</th>
        </tr>
        
    </thead>
    <tbody>
         <tr>
            <td>Loading...</td>
            <td>Loading...</td>
            <td>
                <button >Edit</button>
                <button >Delete</button>
            </td>
        </tr>
    </tbody>

</table>
`
const formTemplate = ()=>html`
<form @submit ="${(event)=>createBookForm(event)}" id="add-form">
    <h3>Add book</h3>
    <label>TITLE</label>
    <input type="text" name="title" placeholder="Title...">
    <label>AUTHOR</label>
    <input type="text" name="author" placeholder="Author...">
    <input type="submit" value="Submit">
</form>

`
const editTemplate =(book)=>html`

<form @submit ="${(event)=>editBookForm(event, book._id)}" id="edit-form">
    <input type="hidden" name="id">
    <h3>Edit book</h3>
    <label>TITLE</label>
    <input type="text" name="title" placeholder="Title..." value="${book.title}">
    <label>AUTHOR</label>
    <input type="text" name="author" placeholder="Author..." value="${book.author}">
    <input type="submit" value="Save">
</form>
`


render([tableTemplate(data), formTemplate()], root)

async function getData() {
    render([loadingTemplate(), formTemplate()], root)
    const books = await getBooks()
    data = Object.entries(books).map(([id, b]) => Object.assign(b, { _id: id }))

    render([tableTemplate(data), formTemplate()], root)
}

function editBook(id) {
    const book = data.filter(x=>x._id==id)[0]

    render([tableTemplate(data), editTemplate(book)], root)

}

async function editBookForm(event, id){
    event.preventDefault()
    const form = document.querySelector('form')

    const formData = new FormData(form)
    const title = formData.get('title')
    const author = formData.get('author')
    await editBookByID(id, {title, author})
    form.reset()
    getData()

}

async function createBookForm(event){

    event.preventDefault()
    const form = document.querySelector('form')

    const formData = new FormData(form)
    const title = formData.get('title')
    const author = formData.get('author')
    await createBook({title, author})
    form.reset()
    getData()
}

async function deleteBook(id){
    await deleteByID(id)
    getData()
}



