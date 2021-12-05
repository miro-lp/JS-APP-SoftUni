
import { login } from "../api/data.js"
import { html } from "../lib.js"
import { createSubmitHandler } from "../util.js"


const loginTemplate = (onSubmit, errorMsg, email) => html`
<section id="login-page" class="auth">
    ${errorMsg ? html` <section id="notifications">
        <div id="errorBox" class="notification">
            <span>${errorMsg}</span>
        </div>
    </section>`: null}
    <form @submit="${onSubmit}" id="login">

        <div class="container">
            <div class="brand-logo"></div>
            <h1>Login</h1>
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" placeholder="Sokka@gmail.com">

            <label for="login-pass">Password:</label>
            <input type="password" id="login-password" name="password">
            <input type="submit" class="btn submit" value="Login">
            <p class="field">
                <span>If you don't have profile click <a href="/register">here</a></span>
            </p>
        </div>
    </form>
</section>`

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

