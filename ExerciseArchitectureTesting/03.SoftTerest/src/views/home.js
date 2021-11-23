import { e } from '../dom.js';

const section = document.querySelector('#homePage');
section.remove();
section.querySelector('#getStartLink').addEventListener('click', (ev) => {
    ev.preventDefault()
    ctx.goTo('catalog')
});
let ctx = null;

export async function showHomePage(ctxTarget) {
    ctx = ctxTarget;
    ctx.showSection(section);
}

