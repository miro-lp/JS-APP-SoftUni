import {logout} from "./api/data.js"
import { html, render, page} from "./lib.js";
import { getUserData } from "./util.js";
import { createPage } from "./view/create.js";
import { detailsPage } from "./view/details.js";
import { homePage } from "./view/home.js";
import { loginPage } from "./view/login.js";
import { registerPage } from "./view/register.js";
import { topicPage } from "./view/topic.js";

const root = document.querySelector('main')
document.getElementById('logoutBtn').addEventListener('click', onLogout)


page(decorateContex)
page('/', homePage)
page('/topics',topicPage)
page('/topics/:id',detailsPage)
page('/login',loginPage)
page('/register',registerPage)
page('/create',createPage)

updateNav()
page.start()

function decorateContex(ctx,next){
    ctx.render = (content)=>render(content, root)
    ctx.updateNav=updateNav;
    next()

}
function updateNav(){
    const userData = getUserData()
    if(userData){
        document.querySelector('.user').style.display = "inline-block"
        document.querySelector('.guest').style.display = "none"
    }else{
        document.querySelector('.user').style.display = "none"
        document.querySelector('.guest').style.display = "inline-block"
    }
}

async function onLogout(){
    await logout()
    updateNav()
    page.redirect('/')

}