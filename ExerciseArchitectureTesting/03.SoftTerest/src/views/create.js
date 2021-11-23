import { createIdea } from '../api/data.js';
import { e } from '../dom.js';

const section = document.querySelector('#createPage');
section.remove();
const form = section.querySelector('form');
form.addEventListener('submit', onCreate);
let ctx = null;

export async function showCreatePage(ctxTarget) {
    ctx = ctxTarget
    ctx.showSection(section);
}

async function onCreate(event) {
    event.preventDefault();

    const formData = new FormData(form);
    const title = formData.get('title').trim();
    const description = formData.get('description').trim();
    const img = formData.get('imageURL').trim();

    if (title.length < 6 || description.length < 10 || img.length < 5) {
        alert('Incorrect data')
        return
    }
    

    await createIdea({ title, description, img });
    form.reset();
    ctx.goTo('catalog');
}