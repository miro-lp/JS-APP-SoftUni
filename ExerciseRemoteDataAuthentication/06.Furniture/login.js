window.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.querySelectorAll('form')[1]
    formLogin.addEventListener('submit', onLogin)

    const formRegister = document.querySelectorAll('form')[0]
    formRegister.addEventListener('submit', onLogin)

})

async function onLogin(e) {
    e.preventDefault()
    const formData = new FormData(e.target)

    const email = formData.get('email')
    const password = formData.get('password')

    try {
        const res = await fetch(`http://localhost:3030/users/login`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
        if(res.ok != true){
            const error = await res.json()
            throw new Error(error.message)
        }

        const data = await res.json()
        const userData={
            email : data.email,
            id: data._id,
            token:data.accessToken
        }
        sessionStorage.setItem('userData', JSON.stringify(userData))
        window.location = 'homeLogged.html'
        
    } catch (error){ 
        alert(error.message)

    }
}

async function createUser(e) {
    e.preventDefault()
    const url = `http://localhost:3030/users/register`
    const formData = new FormData(form)


    const email = formData.get('email').trim()
    const password = formData.get('password').trim()
    const rePass = formData.get('rePass').trim()
    try {
        if(validateEmail(email) == false){
            throw new Error('Email is not valid')
        }
        
        if(rePass!=password){
            throw new Error('Passwords don`t match')
        }

        const res = await fetch(url, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',

            },
            body: JSON.stringify({ email, password })
        })

        const data = await res.json()
        const userData = {
            email: data.email,
            id: data._id,
            token: data.accessToken
        }
        sessionStorage.setItem('userData', JSON.stringify(userData))
        window.location = 'homeLogged.html'
    } catch (error) {
        alert(error.message)
    }
}

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}