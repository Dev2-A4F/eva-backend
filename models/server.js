const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const { dbConnection } = require('../database/config')

class Server {

  constructor() {
    this.app            = express()
    this.port           = process.env.PORT
    this.usuarioPath    = '/api/user'
    this.authPath       = '/api/auth'
    this.postulantePath = '/api/postulante'
    this.servicioPath    = '/api/servicio'
    this.prestacionPath    = '/api/prestacion'


    //Middlewares
    this.middlewares()


    //Rutas de la app
    this.routes()

  }


  middlewares() {
    //Aplicación del CORS
    this.app.use(cors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'access_token', 'Origin', 'X-Requested-With', 'Accept', 'X-HTTP-Method-Override'],
      credentials: false
    }));

    this.app.use(express.json({ limit: '50mb' }));
    this.app.use(express.urlencoded({ limit: '50mb', extended: true }));

    //Lectura y parseo del body
    this.app.use(express.json());

    //morgan para ir viendo las solicitudes por consola
    this.app.use(morgan("dev"))

    //Directorio Publico
    this.app.use(express.static('public'));
  }

  routes() {
    this.app.use(this.authPath, require('../routes/auth'))
    this.app.use(this.usuarioPath, require('../routes/user'))
    this.app.use(this.postulantePath, require('../routes/postulante'))
    this.app.use(this.servicioPath, require('../routes/servicio'))
    this.app.use(this.prestacionPath, require('../routes/prestacion'))

  }

  listen() {
    this.app.listen(this.port, async () => {
       await dbConnection()
       console.log(`Example app listening on port ${this.port}`)
    })
  }
}

module.exports = Server