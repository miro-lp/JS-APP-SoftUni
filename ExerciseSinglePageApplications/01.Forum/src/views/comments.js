
import { getAllComments, createCommnet, getPostById } from '../api/data.js';
import { e } from '../dom.js';

const section = document.querySelector('.theme-content');
section.remove()
const headTopic = section.querySelector('.header')
const sectionComments = section.querySelector('#user-comment')
const form = section.querySelector('form')
form.addEventListener('submit', onPostComment)


let ctx = null;

export async function showCommnetsPage(ctxTarget, id) {
    ctx = ctxTarget;
    
    const topic = await getPostById(id)
    section.querySelector('h2').textContent = topic.topicName
    headTopic.innerHTML = `
    <img data-id="${topic._id}" src="./static/profile.png" alt="avatar">
    <p><span>${topic.username}</span> posted on <time>${topic.dataTime}</time></p>

    <p class="post-content">${topic.postText}</p>
    `
    ctx.showSection(section);
    await getComments(id)

}
async function onPostComment(event) {
    event.preventDefault()
    const img = section.querySelector('img')   
    
    const formData = new FormData(form)
    const username = formData.get('username')
    const postText = formData.get('postText')
    const dataTime = new Date().toLocaleString()
    const ownerId = img.dataset.id

    await createCommnet({ username, postText, dataTime, ownerId })
    form.reset()
    await getComments(img.dataset.id)
    
}

async function getComments(id) {
    let allComments = await getAllComments()
        
    sectionComments.replaceChildren(...Object.values(allComments).filter(c => c.ownerId == id).map(renderComment))
    
}


function renderComment(commnet) {
    const element = e('div', { 'class': ['topic-name-wrapper'] })
    element.innerHTML = `
        <div class="topic-name">
            <p><strong>${commnet.username}</strong> commented on <time>${commnet.dataTime}</time></p>
                <div class="post-content">
                <p>${commnet.postText}</p>
            </div>
            </div>
    `

    return element
}



