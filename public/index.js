// Configurar username
let username = sessionStorage.getItem('username')
if(username == null) {
    username = prompt('Insert username')
    sessionStorage.setItem('username', username)
}

document.getElementById('username').innerHTML = `Usuario: ${username}`
const socket = io()
loadFirstData()

// Configuramos el envio de mensajes
const btnSend = document.getElementById('send')
btnSend.onclick = e => {
    e.preventDefault()
    const msn = document.getElementById('msn').value
    socket.emit('chat-in', {msn, username})
}

const btnSend2 = document.getElementById('send2')
btnSend2.onclick = e => {
    e.preventDefault()
    const item = document.getElementById('item').value
    const price = document.getElementById('price').value
    const url = document.getElementById('url').value
    socket.emit('prod-in', {item, price, url})
}

socket.on('chat-out', data => {
    addDataToDiv(data)
})

socket.on('prod-out', catalog => {
    addDataToTable(catalog)
})

// Muestra en la pagina un solo mensaje
function addDataToDiv(data) {
    const div = document.getElementById('chat')
    div.innerHTML += `<br>[${data.date}] <b>${data.username}</b>: <i>${data.msn}</i>`
}

function addDataToTable(catalog) {
    const table = document.getElementById("products")
    table.innerHTML += `<br> <td>${catalog.item}</td><td>${catalog.price}</td><td>${catalog.url}</td>`
}

// Recupera todos los mensajes a la pagina
function loadDataToDiv(data) {
    console.log(data);
    data.forEach(d => addDataToDiv(d))
}

function loadDataToTable(catalog) {
    console.log(catalog);
    catalog.forEach(p => addDataToTable(p))
}


// Para cargar la data por primera vez
function loadFirstData() {
    fetch('/data')
        .then(data => data.json())
        .then(d => {
            loadDataToDiv(d.data)
        })
        .catch(e => alert(e))
}

function loadFirstProduct() {
    fetch("/products")
        .then(catalog => catalog.json())
        .then(p => {
            loadDataToTable(p.catalog)
        })
        .catch(e => alert(e))
}