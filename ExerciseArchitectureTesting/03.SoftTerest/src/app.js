import * as api from './api/api.js';

import { showHomePage } from './views/home.js';

import { showSection } from './dom.js';
import { showCatalogPage } from './views/catalog.js';
import { showCreatePage } from './views/create.js';
import { showLoginPage } from './views/login.js';
import { showRegisterPage } from './views/register.js';
import { showDetailsPage } from './views/details.js';

const links = {
    'homeLink': 'home',
    'getStartLink': 'home',
    'catalogLink': 'catalog',
    'createLink': 'create',
    'loginLink': 'login',
    'registerLink': 'register',

};

const views = {
    'home': showHomePage,
    'catalog': showCatalogPage,
    'create': showCreatePage,
    'login': showLoginPage,
    'register': showRegisterPage,
    'details':showDetailsPage
};

const ctx = {
    goTo,
    showSection,
    updateNav
}

const nav = document.querySelector('nav');
nav.addEventListener('click', onNavigate);

updateNav()
goTo('home')

async function onNavigate(event) {
    const name = links[event.target.id];
    if (event.target.id == 'logoutLink') {
        event.preventDefault();

        await api.logout()
        updateNav()
        goTo('home')
    }

    if (name) {
        event.preventDefault();
        goTo(name);
    }
}

function goTo(name, ...params) {
    const view = views[name]
    if (typeof view == 'function') {
        view(ctx, ...params)

    }

}

function updateNav() {
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    if (userData != null) {

        [...nav.querySelectorAll('.user')].forEach(l => l.style.display = 'block');
        [...nav.querySelectorAll('.guest')].forEach(l => l.style.display = 'none');
    } else {
        [...nav.querySelectorAll('.user')].forEach(l => l.style.display = 'none');
        [...nav.querySelectorAll('.guest')].forEach(l => l.style.display = 'block');
    }

}