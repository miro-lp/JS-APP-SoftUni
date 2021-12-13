import { login } from "../api/data.js"
import { html } from "../lib.js"
import { createSubmitHandler } from "../util.js"

const loginTemplate = (onSubmit, errorMsg, email) => html`
<div class="narrow center">
    <header>Login</header>
    <form @submit=${onSubmit}>
        ${errorMsg ? html`<p class="error-msg">${errorMsg}</p>` : null}
        <label><span>Email</span> <input type="text" name="email" .value=${email}></label>
        <label><span>Password</span> <input type="password" name="password"></label>
        <input class="action" type="submit" value="Sign in">
    </form>
</div>

`
export function loginPage(ctx) {
    update()
    function update(errorMsg = '', email = '') {
        ctx.render(loginTemplate(createSubmitHandler(onSubmit, 'email', 'password'), errorMsg, email))
    }

    async function onSubmit(data) {

        try {
            await login(data.email, data.password);
            ctx.updateNav()
            ctx.page.redirect('/topics')
        }
        catch (err) {
            update(err.message, data.email)

        }
    }

}
