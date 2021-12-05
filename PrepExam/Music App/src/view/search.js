
import { getItemBySearch } from "../api/data.js"
import { html, render } from "../lib.js"
import { getUserData } from "../util.js"

const searchTemplate = (onSearch) => html`
    <section id="searchPage">
        <h1>Search by Name</h1>
    
        <div class="search">
            <input id="search-input" type="text" name="search" placeholder="Enter desired albums's name">
            <button @click="${onSearch}" class="button-list">Search</button>
        </div>
    
        <h2>Results:</h2>
    
        <div class="search-result">
    
        </div>
    </section>
`

const card = (data, userData) => html`


    <!--If have matches-->
    <div class="card-box">
        <img src=${data.imgUrl}>
        <div>
            <div class="text-center">
                <p class="name">Name: ${data.name}</p>
                <p class="artist">Artist: ${data.artist}</p>
                <p class="genre">Genre: ${data.genre}</p>
                <p class="price">Price: $${data.price}</p>
                <p class="date">Release Date: ${data.releaseDate}</p>
            </div>
    
            ${userData ? html` <div class="btn-group">
                <a href=${'/details/' + data._id} id="details">Details</a>
            </div>` : null}
    
        </div>
    </div>
`

export function searchPage(ctx) {
    ctx.updateNav()

    update()

    function update() {
        ctx.render(searchTemplate(onSearch))
    }

    async function onSearch() {
        let query = document.getElementById('search-input').value

        let userData = getUserData()
        let items = await getItemBySearch(query)
        let itemsUser = items.map(x => [x, userData])
        const searchRoot = document.querySelector('.search-result')
        if (items.length == 0) {
            return  render(html`<p class="no-result">No result.</p>`,searchRoot)
        }
        return render(itemsUser.map(([d, u]) => card(d, u)),searchRoot)
    }

}



