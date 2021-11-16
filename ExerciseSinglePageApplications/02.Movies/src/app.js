import { showCreate } from "./create.js";
import { showDetails } from "./details.js";
import { showEdit } from "./edit.js";
import { showHome } from "./home.js";
import { showLogin } from "./login.js";
import { showRegister } from "./register.js";

const nav = document.querySelector('nav')
updateNav()
showHome()


const views = {
    homeLink: showHome,
    loginLink: showLogin,
    registerLink: showRegister,
}


nav.addEventListener('click', (event) => {
    if (event.target.tagName == 'A') {

        const view = views[event.target.id]
        if (typeof view == 'function') {
            event.preventDefault()
            view()
        }
    }
})
nav.querySelector('#logoutLink').addEventListener('click', onLogout)


export function updateNav() {
    const userData = JSON.parse(sessionStorage.getItem('userData'))
    if (userData != null) {
        nav.querySelector('#emailMsg').textContent = `Welcome, ${userData.email}`;
        [...nav.querySelectorAll('.user')].forEach(e => e.style.display = 'block');
        [...nav.querySelectorAll('.guest')].forEach(e => e.style.display = 'none');
    } else {

        [...nav.querySelectorAll('.user')].forEach(e => e.style.display = 'none');
        [...nav.querySelectorAll('.guest')].forEach(e => e.style.display = 'block');
    }

}

async function onLogout(event) {
    event.preventDefault();
    event.stopImmediatePropagation();

    const { token } = JSON.parse(sessionStorage.getItem('userData'));

    await fetch('http://localhost:3030/users/logout', {
        headers: {
            'X-Authorization': token
        }
    })

    sessionStorage.removeItem('userData');
    updateNav();
    showLogin();
}




