import { register } from '../api/data.js';
import { e } from '../dom.js';

const section = document.querySelector('#registerPage');
section.remove();
const form = section.querySelector('form');
form.addEventListener('submit', onRegister);
let ctx = null;
section.querySelector('a').addEventListener('click',(event)=>
{event.preventDefault()
ctx.goTo('login')})

export async function showRegisterPage(ctxTarget) {
    ctx = ctxTarget
    ctx.showSection(section);
}


async function onRegister(event) {
    event.preventDefault();

    const formData = new FormData(form);
    const email = formData.get('email').trim();
    const password = formData.get('password').trim();
    const rePass = formData.get('repeatPassword').trim();

    if (!email || !password) {
        alert('All fields are required!')
        return
    };

    if (password != rePass) {
        alert('Password don\'t match!')
        return
    }

    await register(email, password);
    form.reset()
    ctx.goTo('home');
    ctx.updateNav();
}