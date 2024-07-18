require('dotenv').config()
const Server = require('./models/server')


//Server Express

const server = new Server()
server.listen()
server.middlewares()


