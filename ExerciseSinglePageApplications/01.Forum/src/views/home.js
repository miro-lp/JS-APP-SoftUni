import { createPost, getAllPosts } from '../api/data.js';
import { e } from '../dom.js';

const section = document.querySelector('.new-topic-border');
section.remove()
const sectionPost = document.querySelector('.topic-title')
sectionPost.remove()

const form = section.querySelector('form')
form.querySelector('.public').addEventListener('click', onPost)


let ctx = null;

export async function showHomePage(ctxTarget) {
    ctx = ctxTarget;
    
    ctx.showSection(section);
    renderPost()
    
}

async function onPost(event) {
    event.preventDefault()

    const formData = new FormData(form)

    const topicName = formData.get('topicName')
    const username = formData.get('username')
    const postText = formData.get('postText')
    const dataTime = new Date()

    await createPost({ topicName, username, postText, dataTime })
    form.reset()
    renderPost()

}

async function renderPost() {
    const posts = await getAllPosts()
  

    if (Object.keys(posts).length == 0) {
        sectionPost.replaceChildren(e('div', { 'class': ['topic-container'] }, 'NO TOPICS!'))
    }else{
        sectionPost.replaceChildren(...Object.values(posts).map(createPostElement))
    }
    
    ctx.showAppendSection(sectionPost)
}

function createPostElement(topic) {
    const element = e('div', { 'class': ['topic-container'] })
    element.innerHTML = `
    <div class="topic-name-wrapper">
    <div class="topic-name">
        <a data-id = "${topic._id}" href="#" class="normal">
            <h2>${topic.topicName}</h2>
        </a>
        <div class="columns">
            <div>
                <p>Date: <time>${topic.dataTime}</time></p>
                <div class="nick-name">
                    <p>Username: <span>${topic.username}</span></p>
                </div>
            </div>
        </div>
    </div>
</div>
    `
    element.querySelector('a').addEventListener('click',()=>ctx.goTo('commnets', topic._id))
    return element
}


