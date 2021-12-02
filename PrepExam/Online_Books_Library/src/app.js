import {logout} from "./api/data.js"
import {render, page} from "./lib.js";
import { getUserData } from "./util.js";
import { allItmesPage } from "./view/dashboard.js";
import { createPage } from "./view/create.js";
import { detailsPage, editPage } from "./view/details.js";
import { loginPage } from "./view/login.js";
import { registerPage } from "./view/register.js";
import { myItemsPage } from "./view/myItems.js";

const root = document.querySelector('main')

page(decorateContex)
page('/', allItmesPage)
page('/login', loginPage)
page('/register', registerPage)
page('/dashboard', allItmesPage)
page('/myBooks', myItemsPage)
page('/details/:id', detailsPage)
page('/edit/:id', editPage)
page('/create', createPage)


updateNav()
page.start()


function decorateContex(ctx, next){
    ctx.render = (content)=>render(content, root)
    ctx.updateNav=updateNav;
    next()
}

function updateNav(){
    const userData = getUserData()
    if(userData){
        document.querySelector('#user').style.display = "inline-block"
        document.querySelector('#guest').style.display = "none"
        document.getElementById('greeting').textContent = `Welcome, ${userData.email}`
        
    }else{
        document.querySelector('#user').style.display = "none"
        document.querySelector('#guest').style.display = "inline-block"
        
    }
}


document.getElementById('logoutBtn').addEventListener('click',onLogout)

function onLogout(){
    logout()
    updateNav()
    page.redirect('/login')

}