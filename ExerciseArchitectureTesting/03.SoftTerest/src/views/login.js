import { login } from '../api/data.js';
import {e} from '../dom.js';

const section = document.querySelector('#loginPage');
section.remove();
section.querySelector('a').addEventListener('click',(event)=>
{event.preventDefault()
ctx.goTo('register')})
const form = section.querySelector('form');
form.addEventListener('submit', onLogin);
let ctx = null;

export async function showLoginPage(ctxTarget){
    ctx = ctxTarget
    ctx.showSection(section);
}

async function onLogin(event){
    event.preventDefault();

    const formData = new FormData(form);
    const email = formData.get('email').trim();
    const password = formData.get('password').trim();

    await login(email, password);
    form.reset();
    ctx.goTo('home');
    ctx.updateNav();
}