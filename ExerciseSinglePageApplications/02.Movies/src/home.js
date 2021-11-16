import { showCreate } from './create.js';
import { showDetails } from './details.js';
import { e, showView } from './dom.js';


const section = document.getElementById('home-page')
const catalog = section.querySelector('.card-deck.d-flex.justify-content-center')
const addMovieBtn = section.querySelector('#add-movie-button')
const addMovieChildEl = section.querySelector('#addLink')

let movieCashe = null
let lastLoad = null
const maxTime = 5000
catalog.addEventListener('click', (event) => {
    let target = event.target
    if (target.tagName == 'BUTTON') {
        target = target.parentElement
    }
    if (target.tagName == 'A') {
        const id = target.dataset.id
        showDetails(id)
    }
})
section.remove();

export function showHome() {
    const userData = JSON.parse(sessionStorage.getItem('userData'))
    if (userData == null) {
        addMovieBtn.replaceChildren()
    } else {
        addMovieBtn.replaceChildren(addMovieChildEl)
        addMovieChildEl.addEventListener('click', (event) => {
            event.preventDefault()
            showCreate()
        })
    }

    getMovies()
    showView(section)

}

async function getMovies() {

    catalog.replaceChildren(e('p', {}, 'Loading...'))
    const now = Date.now()
    if (movieCashe == null || (now - lastLoad) > maxTime) {
        lastLoad = now
        const res = await fetch('http://localhost:3030/data/movies')
        const data = await res.json()
        movieCashe = data
    }

    catalog.replaceChildren(...movieCashe.map(creatMovie))
}

function creatMovie(movie) {
    const element = e('div', { 'class': ['card', 'mb-4'] })
    element.innerHTML = ` <img class="card-img-top" src="${movie.img}"
    alt="Card image cap" width="400">
    <div class="card-body">
    <h4 class="card-title">${movie.title}</h4>
    </div>
    <div class="card-footer">
    <a data-id = ${movie._id} href="#/details/6lOxMFSMkML09wux6sAF">
        <button type="button" class="btn btn-info">Details</button>
    </a>
    </div>`

    return element
}
