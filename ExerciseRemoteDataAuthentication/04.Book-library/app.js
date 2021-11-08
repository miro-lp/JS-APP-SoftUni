console.log('My requests...')
const editFormEl = document.getElementById('editbook')
editFormEl.style.display = 'none'
editFormEl.addEventListener('submit', onEditSubmit)

const tbody = document.querySelector('tbody')
const createFormEl = document.getElementById('createbook')
document.getElementById('loadBooks').addEventListener('click', loadBooks)

createFormEl.addEventListener('submit', onCreate)
tbody.addEventListener('click', onTableClick)

loadBooks()

async function onEditSubmit(event){
    event.preventDefault()
    const formatData = new FormData(event.target)

    const author = formatData.get('author')
    const title = formatData.get('title')
    const id = formatData.get('id')
    const result = await updateBook(id, { author, title })
    event.target.reset()

    loadBooks()
    editFormEl.style.display = 'none'
    createFormEl.style.display = 'block'
}

function onTableClick(event){
    if(event.target.textContent == 'Delete'){
        onDelete(event.target)
    }else if(event.target.textContent == 'Edit'){
        onEdit(event.target)
    }
}
async function onEdit(button){
    createFormEl.style.display = 'none'
    editFormEl.style.display = 'block'
    const id = button.parentElement.dataset.id
    editFormEl.querySelector('[name="id"]').value = id 
    const titleInput = editFormEl.querySelector('[name="title"]')    
    const authorInput = editFormEl.querySelector('[name="author"]')
    const book = await getBookId(id)
   
    titleInput.value = book.title
    authorInput.value = book.author

}

async function getBookId(id){
    const result = await request(`http://localhost:3030/jsonstore/collections/books/` + id)

    return result

}

async function onDelete(button){
    const id = button.parentElement.dataset.id
    
    await deleteBook(id)
    button.parentElement.parentElement.remove()
}

async function onCreate(event) {
    event.preventDefault()

    const formatData = new FormData(event.target)
    const author = formatData.get('author')
    const title = formatData.get('title')
    const result = await createBook({ author, title })
    event.target.reset()

    tbody.appendChild(createRow(result._id, result))

}

function createRow(id, book) {
    const row = document.createElement('tr')
    row.innerHTML = `   <td>${book.title}</td>
    <td>${book.author}</td>
    <td data-id=${id}>
        <button>Edit</button>
        <button >Delete</button>
    </td>`
    return row

}

async function loadBooks() {
    const books = await request(`http://localhost:3030/jsonstore/collections/books`)

    const result = Object.entries(books).map(([id, b]) => createRow(id, b))
    tbody.replaceChildren(...result)

    return books
}

async function createBook(book) {
    const result = await request(`http://localhost:3030/jsonstore/collections/books`, {
        method: 'post',
        body: JSON.stringify(book)
    })

    return result

}

async function updateBook(id, book) {
    const result = await request(`http://localhost:3030/jsonstore/collections/books/` + id, {
        method: 'put',
        body: JSON.stringify(book)
    })

    return result
}

async function deleteBook(id) {
    const result = await request(`http://localhost:3030/jsonstore/collections/books/` + id, {
        method: 'delete',

    })

    return result
}

async function request(url, options) {
    if (options && options.body != undefined) {
        Object.assign(options, {
            headers: { 'Content-Type': 'application/json' }
        })
    }

    const response = await fetch(url, options)
    if (response.ok != true) {
        const error = await response.json()
        alert(error.message)
        throw new Error(error.message)
    }

    const data = await response.json()

    return data
}