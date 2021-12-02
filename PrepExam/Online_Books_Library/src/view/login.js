
import { login } from "../api/data.js"
import { html } from "../lib.js"
import { createSubmitHandler } from "../util.js"

const loginTemplate = (onSubmit, errorMsg, email) => html`       
        <section id="login-page" class="login">
        ${errorMsg ? html` <section id="notifications">
                <div id="errorBox" class="notification">
                    <span>${errorMsg}</span>
                </div>
            </section>`: null}
            <form  @submit="${onSubmit}" id="login-form" action="" method="">

                <fieldset>
                    <legend>Login Form</legend>
                    <p class="field">
                        <label for="email">Email</label>
                        <span class="input">
                            <input type="text" name="email" id="email" placeholder="Email" .value=${email}>
                        </span>
                    </p>
                    <p class="field">
                        <label for="password">Password</label>
                        <span class="input">
                            <input type="password" name="password" id="password" placeholder="Password">
                        </span>
                    </p>
                    <input class="button submit" type="submit" value="Login">
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

