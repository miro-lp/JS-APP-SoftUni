
import { login } from "../api/data.js"
import { html } from "../lib.js"
import { createSubmitHandler } from "../util.js"


const loginTemplate = (onSubmit, errorMsg, email) => html`
<section id="loginPage">
${errorMsg ? html` <section id="notifications">
        <div id="errorBox" class="notification">
            <span>${errorMsg}</span>
        </div>
    </section>`: null}
            <form @submit="${onSubmit}" >
                <fieldset>
                    <legend>Login</legend>

                    <label for="email" class="vhide">Email</label>
                    <input id="email" class="email" name="email" type="text" placeholder="Email">

                    <label for="password" class="vhide">Password</label>
                    <input id="password" class="password" name="password" type="password" placeholder="Password">

                    <button type="submit" class="login">Login</button>

                    <p class="field">
                        <span>If you don't have profile click <a href="/register">here</a></span>
                    </p>
                </fieldset>
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

