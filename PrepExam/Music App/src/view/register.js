
import { register } from "../api/api.js"
import { html, until } from "../lib.js"
import { createSubmitHandler } from "../util.js"


const registerTemplate = (onSubmit, errorMsg, errors, values) => html`
<section id="registerPage">
<section id="register-page" class="content auth">
    ${errorMsg ? html` <section id="notifications">
        <div id="errorBox" class="notification">
            <span>${errorMsg}</span>
        </div>
    </section>`: null}
            <form @submit="${onSubmit}" >
                <fieldset>
                    <legend>Register</legend>

                    <label for="email" class="vhide">Email</label>
                    <input id="email" class="email" name="email" type="text" placeholder="Email">

                    <label for="password" class="vhide">Password</label>
                    <input id="password" class="password" name="password" type="password" placeholder="Password">

                    <label for="conf-pass" class="vhide">Confirm Password:</label>
                    <input id="conf-pass" class="conf-pass" name="conf-pass" type="password" placeholder="Confirm Password">

                    <button type="submit" class="register">Register</button>

                    <p class="field">
                        <span>If you already have profile click <a href="/login">here</a></span>
                    </p>
                </fieldset>
            </form>
        </section>
`

export function registerPage(ctx) {
    update()
    function update(errorMsg, errors = {}, values = {}) {
        ctx.render(registerTemplate(createSubmitHandler(onSubmit,
            'email', 'password', 'conf-pass'), errorMsg, errors, values))
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
            if (data.password != data['conf-pass']) {
                throw {
                    error: new Error('Passwords do not match!'),
                    errors: {
                        password: true,
                        'conf-pass': true
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