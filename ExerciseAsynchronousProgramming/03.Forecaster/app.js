function attachEvents() {

    document.getElementById('submit').addEventListener('click', getLocations)
}

attachEvents();

async function getLocations() {
    const conditions = {
        'Sunny': '&#x2600;',
        'Partly sunny': '&#x26C5;',
        'Overcast': '&#x2601;',
        'Rain': '&#x2614;',
        'Degrees': '&#176;'
    }
    const location = document.getElementById('location').value
    const forcastElement = document.getElementById('forecast')
    const currentEl = document.getElementById('current')
    const divUpcoming = document.getElementById('upcoming')

    const url = `http://localhost:3030/jsonstore/forecaster/locations`


    forcastElement.style.display = 'none'
    const firstCurrentChild = currentEl.children[0]
    currentEl.replaceChildren()
    currentEl.appendChild(firstCurrentChild)

    const firstChild = divUpcoming.children[0]
    divUpcoming.replaceChildren()
    divUpcoming.appendChild(firstChild)

    try {
        const res = await fetch(url)
        const data = await res.json()
        if (data.filter(l => l.name == location).length == 0) {
            throw new Error('Error')
        }
        const locationId = data.filter(l => l.name == location)[0].code
        const [current, upcoming] = await Promise.all([getCurrent(locationId), getUpcoming(locationId)])


        forcastElement.style.display = 'block'
        const newEl = el('div', { 'class': ['forecasts'] }, el('span', { 'class': ['condition', 'symbol'] }, `${conditions[current.forecast.condition]}`),
            el('span', { 'class': ['condition',] }, el('span', { 'class': ['forecast-data',] }, current.name),
                el('span', { 'class': ['forecast-data',] }, `${current.forecast.low}${conditions.Degrees}/${current.forecast.high}${conditions.Degrees}`),
                el('span', { 'class': ['forecast-data',] }, current.forecast.condition)))



        currentEl.appendChild(newEl)
        let divInfoEl = el('div', { 'class': ['forecast-info'] }, '')
        for (let w of upcoming.forecast) {
            const upcomingEl = el('span', { 'class': ['upcoming'] },
                el('span', { 'class': ['symbol'] }, conditions[w.condition]),
                el('span', { 'class': ['forecast-data'] }, `${w.low}${conditions.Degrees}/${w.high}${conditions.Degrees}`),
                el('span', { 'class': ['forecast-data'] }, w.condition))
            divInfoEl.appendChild(upcomingEl)
        }

        divUpcoming.appendChild(divInfoEl)


    } catch (error) {
        forcastElement.style.display = 'block'
        currentEl.appendChild(el('div', {}, 'Error'))

    }


}

async function getCurrent(locationId) {
    const url = `http://localhost:3030/jsonstore/forecaster/today/` + locationId

    const res = await fetch(url)
    const data = await res.json()

    return data
}

async function getUpcoming(locationId) {
    const url = `http://localhost:3030/jsonstore/forecaster/upcoming/` + locationId

    const res = await fetch(url)
    const data = await res.json()

    return data
}

function el(type, attr, ...content) {
    const element = document.createElement(type)
    for (let prop in attr) {
        if (prop == 'class') {
            for (let c of attr[prop]) {
                element.classList.add(c)
            }
        } else {
            element[prop] = attr[prop]
        }
    }
    for (let item of content) {
        if (typeof item == 'string' || typeof item == 'number') {
            element.innerHTML = item

        } else {
            element.appendChild(item)
        }
    }
    return element
}