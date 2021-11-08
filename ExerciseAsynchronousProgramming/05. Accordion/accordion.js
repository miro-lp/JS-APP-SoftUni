window.onload = solution()
async function solution() {
    const articles = await getAllArticles()
    const mainElement = document.getElementById('main')
    for (let a of articles) {
        const divElement = document.createElement('div')
        divElement.className = 'accordion'
        divElement.innerHTML = `
        <div class="head">
                <span>${a.title}</span>
                <button class="button" id="${a._id}">More</button>
            </div>
            <div class="extra">
                <p>Loading .....</p>
            </div>
        `
        divElement.querySelector('button').addEventListener('click', (e) => {
            const displayElement = divElement.querySelector('[class="extra"]')
            const pElement = divElement.querySelector('p')

            if (e.target.textContent == 'More') {
                e.target.textContent = 'Less'
                displayElement.style.display = 'block'
                addArticleContent(pElement, a._id)
            } else {
                e.target.textContent = 'More'
                displayElement.style.display = 'none'
            }
        })
        mainElement.appendChild(divElement)
    }
}

async function getAllArticles() {
    const url = `http://localhost:3030/jsonstore/advanced/articles/list`

    const res = await fetch(url)
    const data = await res.json()

    return data
}

async function getAllArticleId(id) {
    const url = `http://localhost:3030/jsonstore/advanced/articles/details/` + id

    const res = await fetch(url)
    const data = await res.json()

    return data
}

async function addArticleContent(element, id) {
    const articleData = await getAllArticleId(id)
    element.textContent = articleData.content
}