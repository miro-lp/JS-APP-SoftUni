
import { register } from "../api/api.js"
import { html, until } from "../lib.js"
import { createSubmitHandler } from "../util.js"

const registerTemplate = (onSubmit, errorMsg, errors, values) => html`       
        <section id="register">
            <form @submit="${onSubmit}" id="register-form">
                <div class="container">
                    ${errorMsg ? html` <section id="notifications">
                        <div id="errorBox" class="notification">
                            <span>${errorMsg}</span>
                        </div>
                    </section>`: null}
                    <h1>Register</h1>
                    <label for="username">Username</label>
                    <input id="username" type="text" placeholder="Enter Username" name="username">
                    <label for="email">Email</label>
                    <input id="email" type="text" placeholder="Enter Email" name="email">
                    <label for="password">Password</label>
                    <input id="password" type="password" placeholder="Enter Password" name="password">
                    <label for="repeatPass">Repeat Password</label>
                    <input id="repeatPass" type="password" placeholder="Repeat Password" name="repeatPass">
                    <div class="gender">
                        <input type="radio" name="gender" id="female" value="female">
                        <label for="female">Female</label>
                        <input type="radio" name="gender" id="male" value="male" checked>
                        <label for="male">Male</label>
                    </div>
                    <input type="submit" class="registerbtn button" value="Register">
                    <div class="container signin">
                        <p>Already have an account?<a href="/login">Sign in</a>.</p>
                    </div>
                </div>
            </form>
        </section>
`


export function registerPage(ctx) {
    update()
    function update(errorMsg, errors = {}, values = {}) {
        ctx.render(registerTemplate(createSubmitHandler(onSubmit,
            'email', 'username', 'password', 'repeatPass'), errorMsg, errors, values))
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
            if (data.password != data.repeatPass) {
                throw {
                    error: new Error('Passwords do not match!'),
                    errors: {
                        password: true,
                        repeatPass: true
                    }
                }

            }
            await register(data.email, data.username, data.password);
            event.target.reset()
            ctx.updateNav()
            ctx.page.redirect('/')

        } catch (err) {

            const message = err.message || err.error.message
            update(message, err.errors, data)

        }
    }

}