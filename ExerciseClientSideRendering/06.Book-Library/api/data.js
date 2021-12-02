import * as api from './api.js';



export async function getBooks(){
    return api.get('/jsonstore/collections/books');

}

export async function getBookByID(id){
    return api.get('/jsonstore/collections/books/' + id);

} 

export async function editBookByID(id, data){
    return api.put('/jsonstore/collections/books/' + id, data);

} 


export async function createBook (book){
    return api.post('/jsonstore/collections/books', book)

}

export async function deleteByID(id){
    return api.del('/jsonstore/collections/books/' + id);

}