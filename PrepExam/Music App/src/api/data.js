import * as api from './api.js'

export const login = api.login
export const register = api.register
export const logout = api.logout

const endPoints = {
    all: '/data/albums?sortBy=_createdOn%20desc&distinct=name',
    byId: '/data/albums/',
    create: '/data/albums/',
    edit: '/data/albums/',
    delete: '/data/albums/',
    search: (query) => `/data/albums?where=name%20LIKE%20%22${query}%22`
}


export async function getAllItems() {
    return api.get(endPoints.all)

}

export async function getItemById(id) {
    return api.get(endPoints.byId + id)

}


export async function createItem(data) {
    return api.post(endPoints.create, data)

}

export async function editItem(id, data) {
    return api.put(endPoints.edit + id, data)

}

export async function deleteItem(id) {
    return api.del(endPoints.delete + id)

}

export async function getItemBySearch(query) {
    return api.get(endPoints.search(query))

}
