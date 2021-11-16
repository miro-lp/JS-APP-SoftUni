import * as api from './api.js';


export async function getAllPosts(){
    return api.get('/jsonstore/collections/myboard/posts');

}

export async function getAllComments(){
    return api.get('/jsonstore/collections/myboard/comments');

}

export async function getPostById(id){
    return api.get('/jsonstore/collections/myboard/posts/' + id);

}


export async function createPost (data){
    return api.post('/jsonstore/collections/myboard/posts', data)

}

export async function createCommnet (data){
    return api.post('/jsonstore/collections/myboard/comments', data)

}

// export async function deleteByID(id){
//     return api.del('/data/ideas/' + id);

// }