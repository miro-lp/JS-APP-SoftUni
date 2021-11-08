function solve() {
    const lable = document.querySelector('#info span')
    const departButton = document.getElementById('depart')
    const arriveButton = document.getElementById('arrive')
    let data = {
        next:'depot'
    }

    async function depart() {

        const url =` http://localhost:3030/jsonstore/bus/schedule/${data.next}`
        departButton.disabled = true
        const res = await fetch(url)
        data = await res.json()
        
        lable.textContent = `Next stop ${data.name}`
        departButton.disabled = true
        arriveButton.disabled = false
    }

    function arrive() {
        lable.textContent = `Arriving at ${data.name}`

        departButton.disabled = false
        arriveButton.disabled = true
    }

    return {
        depart,
        arrive
    };
}

let result = solve();