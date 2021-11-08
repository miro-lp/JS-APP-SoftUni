function attachEvents() {
   document.getElementById('btnLoadPosts').addEventListener('click', getAllPost)
   document.getElementById('btnViewPost').addEventListener('click', displayPost)
}



async function displayPost(){
    const postId = document.getElementById('posts').value

    const[post,comments]= await Promise.all([getPOSTbyID(postId),getCommentByID(postId)])

    document.getElementById('post-title').textContent = post.title
    document.getElementById('post-body').textContent = post.body
    
    const ulElement = document.getElementById('post-comments')
    ulElement.replaceChildren()
    comments.forEach(c=>{
        const liElement = document.createElement('li')
        liElement.textContent=c.text 
        ulElement.appendChild(liElement)
    })

}

async function getAllPost(){
    const url = `http://localhost:3030/jsonstore/blog/posts`;

    const res = await fetch(url);
    const data  = await res.json();
    const selectElement = document.getElementById('posts')
    selectElement.replaceChildren()
    Object.values(data).forEach(p=>{
        const optionElement = document.createElement('option')
        optionElement.textContent = p.title
        optionElement.value = p.id 
        selectElement.appendChild(optionElement)
    })

}
async function getPOSTbyID(postId){
    const url = `http://localhost:3030/jsonstore/blog/posts/` + postId;

    const res = await fetch(url);
    const data  = await res.json();
    return data

}

async function getCommentByID(postId){
    const url = `http://localhost:3030/jsonstore/blog/comments`;

    const res = await fetch(url);
    const data  = await res.json();
    const comments = Object.values(data).filter(c=>c.postId == postId)
    return comments

}
attachEvents();