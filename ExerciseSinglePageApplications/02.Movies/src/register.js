import { showView } from './dom.js';
import { showHome } from './home.js';
import { updateNav } from './app.js';

const section = document.getElementById('form-sign-up')
const form = section.querySelector('form')
form.addEventListener('submit', onRegister)
section.remove();

export function showRegister() {
    showView(section)
}

async function onRegister(event) {
    event.preventDefault()
    const url = `http://localhost:3030/users/register`
    const formData = new FormData(form)


    const email = formData.get('email').trim()
    const password = formData.get('password').trim()
    const rePass = formData.get('repeatPassword').trim()
    try {
        if (validateEmail(email) == false) {
            throw new Error('Email is not valid')
        }

        if (rePass != password) {
            throw new Error('Passwords don`t match')
        }
        if (password.length < 6) {
            throw new Error('The password should be at least 6 characters long')
        }

        const res = await fetch(url, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        })

        const data = await res.json()
        
        sessionStorage.setItem('userData', JSON.stringify({
            email: data.email,
            id: data._id,
            token: data.accessToken
        }))
        form.reset()
        updateNav()
        showHome()
    } catch (error) {
        alert(error.message)
    }
}

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}