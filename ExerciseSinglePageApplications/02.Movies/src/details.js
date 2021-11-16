import { e, showView } from './dom.js';
import { showEdit } from './edit.js';
import { showHome } from './home.js';

const section = document.getElementById('movie-example')
section.remove();


export async function showDetails(id) {
    const userData = JSON.parse(sessionStorage.getItem('userData'))

    const [movie, like, hasLike] = await getMovie(id)
    
    section.innerHTML = `
    <div class="container">
    <div class="row bg-light text-dark">
        <h1>Movie title: ${movie.title}</h1>

        <div class="col-md-8">
            <img class="img-thumbnail" src="${movie.img}"
                alt="Movie">
        </div>
        <div class="col-md-4 text-center">
            <h3 class="my-3 ">Movie Description</h3>
            <p>${movie.description}</p>
            <div id='detailsBtns'>

            </div>
        </div>
    </div>
</div>
    `
    const divDetailsBtns = section.querySelector('#detailsBtns')
    const deleteEl = e('a', { 'class': ['btn', 'btn-danger'], 'href': '#' }, 'Delete')
    const editEl = e('a', { 'class': ['btn', 'btn-warning'], 'href': '#' }, 'Edit')
    const likeEl = e('a', { 'class': ['btn', 'btn-primary'], 'href': '#' }, 'Like')
    const disLikeEl = e('a', { 'class': ['btn', 'btn-primary'], 'href': '#' }, 'Dislike')
    likeEl.addEventListener('click', () => likeMovie(movie))
    disLikeEl.addEventListener('click', () => disLike(movie, hasLike[0]._id))
    deleteEl.addEventListener('click',()=>deleteMovie(id))
    editEl.addEventListener('click', () => showEdit(movie))
    if (userData != null) {
        if (userData.id == movie._ownerId) {
            divDetailsBtns.appendChild(deleteEl)
            divDetailsBtns.appendChild(editEl)
        } else {
            if (hasLike && hasLike.length > 0) {
                divDetailsBtns.appendChild(disLikeEl)

            } else {
                divDetailsBtns.appendChild(likeEl)
            }
        }
    }

    divDetailsBtns.appendChild(e('span', { 'class': ['enrolled-span'] }, `Liked ${like}`))
    showView(section)



    async function getMovie(id) {

        const res = [fetch('http://localhost:3030/data/movies/' + id),
        fetch(`http://localhost:3030/data/likes?where=movieId%3D%22${id}%22&distinct=_ownerId&count`),
        ]
    
        if(userData!=null){
            res.push(fetch(`http://localhost:3030/data/likes?where=movieId%3D%22${id}%22%20and%20_ownerId%3D%22${userData.id}%22 `))
        }
    
        const [movieRes, likeRes, hasLikeRes] = await Promise.all(res)
        const [movieData, likeData, hasLike] = await Promise.all([movieRes.json(), likeRes.json(), hasLikeRes ? hasLikeRes.json(): undefined])
    
        return [movieData, likeData, hasLike]
    }
    
    async function likeMovie(movie) {

        divDetailsBtns.replaceChildren(e('span', { 'class': ['enrolled-span'] }, `Loading...`))
        

        await fetch('http://localhost:3030/data/likes', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': userData.token
            },
            body: JSON.stringify({
                movieId: movie._id
            })
        })
        showDetails(movie._id)
    }
    
    async function disLike(movie, id) {
        divDetailsBtns.replaceChildren(e('span', { 'class': ['enrolled-span'] }, `Loading...`))

        await fetch('http://localhost:3030/data/likes/' +id, {
            method: 'delete',
            headers: {
                'X-Authorization': userData.token
            },
        })
        showDetails(movie._id)
    }
    
    async function deleteMovie(id) {
        await fetch('http://localhost:3030/data/movies/' +id, {
            method: 'delete',
            headers: {
                'X-Authorization': userData.token
            },
        })
    
        showHome()
        
    }
}









