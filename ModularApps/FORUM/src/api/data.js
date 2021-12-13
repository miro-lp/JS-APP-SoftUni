import * as api from './api.js'

export const login = api.login
export const register = api.register
export const logout = api.logout

const endPoints={
    all:'/data/topics',
    byId:'/data/topics/',
    // myItem: (userId)=>`/data/catalog?where=_ownerId%3D%22${userId}%22`,
    create:'/data/topics',
    topicCount:'/data/topics?count',
    // edit:'/data/catalog/',
    // delete:'/data/catalog/',
}


export async function getAllTopics(){
    return api.get(endPoints.all)

}
export async function getTopicCount(){
    return api.get(endPoints.topicCount)

}

 export async function getTopicById(id){
     return api.get(endPoints.byId + id)

 }

// export async function getMyItmes(id){
//     return api.get(endPoints.myItem(id))

// }

export async function createTopic(data){
    return api.post(endPoints.create, data)

}

// export async function editItmes(id, data){
//     return api.put(endPoints.edit + id, data)

// }

// export async function deleteItmes(id){
//     return api.del(endPoints.delete + id)

// }