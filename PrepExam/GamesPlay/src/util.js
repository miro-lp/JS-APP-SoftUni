export function getUserData() {
    return JSON.parse(sessionStorage.getItem('userData'));
}

export function setUserData(data) {
    sessionStorage.setItem('userData', JSON.stringify(data));
}

export function clearUserData() {
    sessionStorage.removeItem('userData');
}

export function createSubmitHandler(callBack, ...fieldNames) {
    return function (event) {
        event.preventDefault()
        const formData = new FormData(event.target)
        const result = {}

        for (let f of fieldNames) {
            result[f] = formData.get(f)
        }
        callBack(result, event)
    }
}

