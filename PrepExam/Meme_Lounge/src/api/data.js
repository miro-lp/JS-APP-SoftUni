import * as api from './api.js'

export const login = api.login
export const register = api.register
export const logout = api.logout

const endPoints={
    all:'/data/memes?sortBy=_createdOn%20desc',
    byId:'/data/memes/',
    myMemes: (userId)=>`/data/memes?where=_ownerId%3D%22${userId}%22&sortBy=_createdOn%20desc`,
    create:'/data/memes',
    // topicCount:'/data/topics?count',
    edit:'/data/memes/',
    delete:'/data/memes/',
}


export async function getAllMemes(){
    return api.get(endPoints.all)

 }
// export async function getTopicCount(){
//     return api.get(endPoints.topicCount)

// }

export async function getMemeById(id){
     return api.get(endPoints.byId + id)

 }



export async function getMyMemes(id){
    return api.get(endPoints.myMemes(id))

}

export async function createMeme(data){
    return api.post(endPoints.create, data)

}

export async function editMeme(id, data){
    return api.put(endPoints.edit + id, data)

}

export async function deleteMeme(id){
    return api.del(endPoints.delete + id)

}