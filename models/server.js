const express = require('express')
const cors = require('cors')
const { dbConnection } = require('../database/config')

class Server {

  constructor() {
    this.app            = express()
    this.port           = process.env.PORT
    this.usuarioPath    = '/api/user'
    this.authPath       = '/api/auth'
    this.postulantePath = '/api/postulante'
    this.servicioPath      = '/api/servicio'



    //Conectar a base de datos
    this.conectarDB()

    //Middlewares
    this.middlewares()


    //Rutas de la app
    this.routes()

  }

  async conectarDB() {
    await dbConnection()
  }

  middlewares() {
    //Aplicación del CORS
    this.app.use(cors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'access_token', 'Origin', 'X-Requested-With', 'Accept', 'X-HTTP-Method-Override'],
      credentials: false
    }));

    //Lectura y parseo del body
    this.app.use(express.json());

    //Directorio Publico
    this.app.use(express.static('public'));
  }

  routes() {
    this.app.use(this.authPath, require('../routes/auth'))
    this.app.use(this.usuarioPath, require('../routes/user'))
    this.app.use(this.postulantePath, require('../routes/postulante'))
    this.app.use(this.servicioPath, require('../routes/servicio'))

  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Example app listening on port ${this.port}`)
    })
  }
}

module.exports = Server