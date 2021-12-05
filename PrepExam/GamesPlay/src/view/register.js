
import { register } from "../api/api.js"
import { html, until } from "../lib.js"
import { createSubmitHandler } from "../util.js"


const registerTemplate = (onSubmit, errorMsg, errors, values) => html`
<section id="register-page" class="content auth">
    ${errorMsg ? html` <section id="notifications">
        <div id="errorBox" class="notification">
            <span>${errorMsg}</span>
        </div>
    </section>`: null}

    <form @submit="${onSubmit}" id="register">
        <div class="container">
            <div class="brand-logo"></div>
            <h1>Register</h1>

            <label for="email">Email:</label>
            <input type="email" id="email" name="email" placeholder="maria@email.com">

            <label for="pass">Password:</label>
            <input type="password" name="password" id="register-password">

            <label for="con-pass">Confirm Password:</label>
            <input type="password" name="confirm-password" id="confirm-password">

            <input class="btn submit" type="submit" value="Register">

            <p class="field">
                <span>If you already have profile click <a href="/login">here</a></span>
            </p>
        </div>
    </form>
</section>
`

export function registerPage(ctx) {
    update()
    function update(errorMsg, errors = {}, values = {}) {
        ctx.render(registerTemplate(createSubmitHandler(onSubmit,
            'email', 'password', 'confirm-password'), errorMsg, errors, values))
    }

    async function onSubmit(data, event) {
        try {
            const missing = Object.entries(data).filter(([k, v]) => v == '')
            if (missing.length > 0) {
                const errors = missing.reduce((a, [k, v]) => Object.assign(a, { [k]: true }), {})
                throw {
                    error: new Error('All fields are required!'),
                    errors
                }
            }
            if (data.password != data['confirm-password']) {
                throw {
                    error: new Error('Passwords do not match!'),
                    errors: {
                        password: true,
                        'confirm-pass': true
                    }
                }
            }
            await register(data.email, data.password);
            event.target.reset()
            ctx.updateNav()
            ctx.page.redirect('/')

        } catch (err) {

            const message = err.message || err.error.message
            update(message, err.errors, data)
        }
    }
}