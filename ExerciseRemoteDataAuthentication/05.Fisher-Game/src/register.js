window.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form')
    form.addEventListener('submit', createUser)

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
            window.location = 'index.html'
        } catch (error) {
            alert(error.message)
        }
    }

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
})

