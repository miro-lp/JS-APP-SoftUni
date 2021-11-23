const main = document.querySelector('main')

export function showSection(section){

    main.replaceChildren(section)
}


export function e(type, attr, ...content) {
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
            const node = document.createTextNode(item)
            element.appendChild(node)

        } else {
            element.appendChild(item)
        }
    }
    return element
}
