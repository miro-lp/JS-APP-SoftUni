import * as api from './api.js'

export const login = api.login
export const register = api.register
export const logout = api.logout

const endPoints={
    home:'/data/games?sortBy=_createdOn%20desc&distinct=category',
    all:'/data/games?sortBy=_createdOn%20desc',
    byId:'/data/games/',
    create:'/data/games/',
    createcomment:'/data/comments',
    edit:'/data/games/',
    delete:'/data/games/',
    comments:(gameId)=>`/data/comments?where=gameId%3D%22${gameId}%22`,
    
}


export async function getAllItems(){
    return api.get(endPoints.all)

 }

 export async function getAllItemsHome(){
    return api.get(endPoints.home)

 }


export async function getItemById(id){
     return api.get(endPoints.byId + id)

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

export async function getComments(id){
    return api.get(endPoints.comments(id))

}

export async function getIsLiked(userId,bookId){
    return api.get(endPoints.isLiked(userId,bookId))

}

export async function postComment(data){
    return api.post(endPoints.createcomment, data)

}
