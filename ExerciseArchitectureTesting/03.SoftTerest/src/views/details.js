import { getIdeaByID } from '../api/data.js';
import { deleteByID } from '../api/data.js';
import { e } from '../dom.js';

const section = document.querySelector('#detailsPage');
section.remove();
let ctx = null;

export async function showDetailsPage(ctxTarget, id) {
    ctx = ctxTarget
    const newSection = await loadDetailsIdea(id)
    ctx.showSection(newSection);
}

async function loadDetailsIdea(id) {
    const userData = JSON.parse(sessionStorage.getItem('userData'));

    const idea = await getIdeaByID(id)

    section.innerHTML = `
    <img class="det-img" src="${idea.img}" />
            <div class="desc">
                <h2 class="display-5">${idea.title}</h2>
                <p class="infoType">Description:</p>
                <p class="idea-description">${idea.description}</p>
            </div>
           
    `
    if (userData && idea._ownerId == userData.id) {
        const el = e('div', { 'class': ['text-center'] }, e('a', { 'class': ['btn', 'detb'], 'href': '' }, 'Delete'))
        el.addEventListener('click', onDelete)
        section.appendChild(el)
    }
    return section

    async function onDelete(event) {
        event.preventDefault()
        const confirmed = confirm('Are you sure you want to delete!')
        if (confirmed) {
            await deleteByID(idea._id)
            ctx.goTo('catalog')
        }

    }
}

