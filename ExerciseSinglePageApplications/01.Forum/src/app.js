

import { showSection,showAppendSection } from './dom.js';
import { showCommnetsPage } from './views/comments.js';
import { showHomePage } from './views/home.js';




const views = {
    'home': showHomePage,
    'commnets': showCommnetsPage

};

const ctx = {
    goTo,
    showSection,
    showAppendSection,
   
}


goTo('home')



function goTo(name, ...params) {
    const view = views[name]
    if (typeof view == 'function') {
        view(ctx, ...params)

    }

}

document.querySelector('header nav a').addEventListener('click',()=>ctx.goTo('home'))