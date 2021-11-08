async function lockedProfile() {
    let mainElement = document.getElementById('main')
    
    mainElement.addEventListener('click',(e)=>{
        if (e.target.tagName == 'BUTTON' ){
            let radioButton = e.target.parentElement.querySelector('div input[value="unlock"]')
            let hiddenElement =e.target.parentElement.querySelector('div') 
            if(radioButton.checked == true){
                if(hiddenElement.style.display == 'none'){
            hiddenElement.style.display = 'inline-block'
            e.target.textContent = 'Hide it'}else{
                hiddenElement.style.display = 'none'
            e.target.textContent = 'Show more'
            }   
        }

        }
    })

    const data = await getProfiles()
    
    for (let id in data){
        const divProfileEL = el('div',{'class':['profile']},'')
        divProfileEL.innerHTML=`<img src="./iconProfile2.png" class="userIcon" />
        <label>Lock</label>
        <input type="radio" name="user1Locked" value="lock" checked>
        <label>Unlock</label>
        <input type="radio" name="user1Locked" value="unlock"><br>
        <hr>
        <label>Username</label>
        <input type="text" name="user1Username" value="${data[id].username}" disabled readonly />
        <div id="user1HiddenFields">
            <hr>
            <label>Email:</label>
            <input type="email" name="user1Email" value="${data[id].email}" disabled readonly />
            <label>Age:<</label>
            <input type="email" name="user1Age" value="${data[id].age}" disabled readonly />
        </div>
        <button>Show more</button>`

        mainElement.appendChild(divProfileEL)
        
    }

    
}


async function getProfiles(){
    const url = `http://localhost:3030/jsonstore/advanced/profiles`

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
