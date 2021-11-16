import { showDetails } from './details.js';
import { showView } from './dom.js';



const section = document.getElementById('edit-movie')
const form = section.querySelector('form')

section.remove();

export function showEdit(movie) {
    const userData = JSON.parse(sessionStorage.getItem('userData'))
    form.querySelector('[name="title"]').value = movie.title
    form.querySelector('[name="description"]').value = movie.description
    form.querySelector('[name="imageUrl"]').value = movie.img

    showView(section)

    async function onEdit(event) {
        event.preventDefault()
        const formData = new FormData(form)
        const title = formData.get('title').trim()
        const description = formData.get('description').trim()
        const img = formData.get('imageUrl').trim()
        
    
    
        const res = await fetch('http://localhost:3030/data/movies/' + movie._id, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': userData.token
            },
            body: JSON.stringify({ title, description, img })
    
        })

        showDetails(movie._id)
    }

    form.addEventListener('submit', onEdit)
}


// async function editMovie(id) {
//     await fetch('http://localhost:3030/data/movies/' +id, {
//         method: 'put',
//         headers: {
//             'Content-Type': 'application/json',
//             'X-Authorization': userData.token
//         },
//         body: JSON.stringify({

//         })
//     })

//     showHome()

// }
