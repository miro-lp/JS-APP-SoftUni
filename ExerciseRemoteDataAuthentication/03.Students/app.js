console.log('TODO...');
const tbody = document.querySelector('tbody')
const form = document.querySelector('form')
form.addEventListener('submit',submitStudent)

loadStudents()

function submitStudent(e){
    e.preventDefault()

    const formatData = new FormData(e.target)
    const firstName = formatData.get('firstName')
    const lastName = formatData.get('lastName')
    const facultyNumber = formatData.get('facultyNumber')
    const grade = Number(formatData.get('grade'))
    createStudent({ firstName, lastName, facultyNumber, grade })
    
    e.target.reset()
    loadStudents()

}

async function createStudent(student) {
    const result = await request(`http://localhost:3030/jsonstore/collections/students`, {
        method: 'post',
        body: JSON.stringify(student)
    })

    return result

}


async function loadStudents() {
    const students = await request(`http://localhost:3030/jsonstore/collections/students`)
    
    

    const result = Object.values(students).map((s) => createRow(s))
    tbody.replaceChildren(...result)

    return students
}

function createRow(student) {
    const row = document.createElement('tr')
    row.innerHTML = `   <td>${student.firstName}</td>
    <td>${student.lastName}</td>
    <td >${student.facultyNumber}</td>
    <td >${student.grade.toFixed(2)}</td>`
    return row

}


async function request(url, options) {
    if (options && options.body != undefined) {
        Object.assign(options, {
            headers: { 'Content-Type': 'application/json' }
        })
    }

    const response = await fetch(url, options)
    if (response.ok != true) {
        const error = await response.json()
        alert(error.message)
        throw new Error(error.message)
    }

    const data = await response.json()

    return data
}