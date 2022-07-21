const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const Contenedor = require('./contenedor/contenedorFile')

const app = express()
const db = new Contenedor('db.json')
const prod = new Contenedor("prod.json")


app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')) //Bootstrap

const server = http.createServer(app)
const io = new Server(server)

app.use('/public', express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/data', (req, res) => {
    const data = db.getAll()
    res.json({data})
})

app.get("/products", (req, res) => {
    const catalog = prod.getAll()
    res.json({catalog})
})

io.on('connection', socket => {
    console.log('Somebody connected!');

    socket.on('chat-in', data => {
        const date = new Date().toLocaleTimeString()
        const dataOut = {
            msn: data.msn,
            username: data.username,
            date
        }
        // Guardar en DB
        db.save(dataOut)

        console.log(dataOut)
        io.sockets.emit('chat-out', dataOut)
    })

    socket.on('prod-in', catalog => {
        const prodOut = {
            item: catalog.item,
            price: catalog.price,
            url: catalog.url
        }
        // Guardar en DB
        prod.save(prodOut)

        console.log(prodOut)
        io.sockets.emit('prod-out', prodOut)
    })
})

const PORT = process.env.PORT || 8080

server.listen(PORT, () => {
    console.log('Running...');
})