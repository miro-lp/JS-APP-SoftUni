
import { login } from "../api/data.js"
import { html } from "../lib.js"
import { createSubmitHandler } from "../util.js"

const loginTemplate = (onSubmit, errorMsg, email) => html`       
<section id="login">
    <form @submit="${onSubmit}" id="login-form">
        <div class="container">
            ${errorMsg ? html` <section id="notifications">
                <div id="errorBox" class="notification">
                    <span>${errorMsg}</span>
                </div>
            </section>`: null}
            <h1>Login</h1>
            <label for="email">Email</label>
            <input id="email" placeholder="Enter Email" name="email" type="text" .value=${email}>
            <label for="password">Password</label>
            <input id="password" type="password" placeholder="Enter Password" name="password">
            <input type="submit" class="registerbtn button" value="Login">
            <div class="container signin">
                <p>Dont have an account?<a href="/register">Sign up</a>.</p>
            </div>
        </div>
    </form>
</section>
`

export function loginPage(ctx) {
    update()

    function update(errorMsg = '', email = '') {
        ctx.render(loginTemplate(createSubmitHandler(onSubmit, 'email', 'password'), errorMsg, email))
    }

    async function onSubmit(data) {


        try {
            const missing = Object.entries(data).filter(([k, v]) => v == '')
            if (missing.length > 0) {
                const errors = missing.reduce((a, [k, v]) => Object.assign(a, { [k]: true }), {})
                throw {
                    error: new Error('All fields are required!'),
                    errors
                }
            }
            await login(data.email, data.password);
            ctx.updateNav()
            ctx.page.redirect('/')
        }
        catch (err) {
            const message = err.message || err.error.message
            update(message, data.email)
        }
    }
}

