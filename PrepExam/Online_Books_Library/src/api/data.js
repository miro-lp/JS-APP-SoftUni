import * as api from './api.js'

export const login = api.login
export const register = api.register
export const logout = api.logout

const endPoints={
    all:'/data/books?sortBy=_createdOn%20desc',
    byId:'/data/books/',
    myItems: (userId)=>`/data/books?where=_ownerId%3D%22${userId}%22&sortBy=_createdOn%20desc`,
    create:'/data/books',
    createLikes:'/data/likes',
    edit:'/data/books/',
    delete:'/data/books/',
    likesCount:(bookId)=>`/data/likes?where=bookId%3D%22${bookId}%22&distinct=_ownerId&count`,
    isLiked:(bookId, userId)=>`/data/likes?where=bookId%3D%22${bookId}%22%20and%20_ownerId%3D%22${userId}%22&count`
}


export async function getAllItems(){
    return api.get(endPoints.all)

 }


export async function getItemById(id){
     return api.get(endPoints.byId + id)

 }

export async function getMyItems(id){
    return api.get(endPoints.myItems(id))

}

export async function createItem(data){
    return api.post(endPoints.create, data)

}

export async function editItem(id, data){
    return api.put(endPoints.edit + id, data)

}

export async function deleteItem(id){
    return api.del(endPoints.delete + id)

}

export async function getLikesCount(id){
    return api.get(endPoints.likesCount(id))

}

export async function getIsLiked(userId,bookId){
    return api.get(endPoints.isLiked(userId,bookId))

}

export async function createLike(data){
    return api.post(endPoints.createLikes, data)

}
