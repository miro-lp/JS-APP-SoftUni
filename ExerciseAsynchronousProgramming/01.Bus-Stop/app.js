async function getInfo() {
    const stopId = document.getElementById('stopId').value
    const url = `http://localhost:3030/jsonstore/bus/businfo/${stopId}` 
    const nameElement = document.getElementById('stopName')
    const ulElement = document.getElementById('buses')

    try {
        nameElement.textContent = 'Loading ...'
        ulElement.replaceChildren()
        const res = await fetch(url)
        if(res.status!=200){
            throw Error('Stop ID not found')
        }
        const data = await res.json()
        
        nameElement.textContent = data.name
        Object.entries(data.buses).forEach(b=>{
            const liElm = document.createElement('li')
            liElm.textContent = `Bus ${b[0]} arrives in ${b[1]} minutes`
            ulElement.appendChild(liElm)
        })
    } catch (error){

        nameElement.textContent = 'Error'
    }
}