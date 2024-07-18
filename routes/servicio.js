const { Router } = require('express')
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos')
const { inicioServicio } = require('../controllers/servicio.controller')
const { validarJWT } = require('../middlewares/validar-jwt')



const router = Router()

router.post('/inicioServicio', [
  validarJWT,
  check('fecha', 'La fecha es obligatoria').not().isEmpty(),
  check('hora', 'La hora es obligatoria').not().isEmpty(),
  validarCampos
], inicioServicio )




module.exports = router