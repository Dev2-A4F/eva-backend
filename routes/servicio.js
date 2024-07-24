const { Router } = require('express')
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos')
const { inicioServicio, updateServicio } = require('../controllers/servicio.controller')
const { validarJWT } = require('../middlewares/validar-jwt')



const router = Router()

router.post('/inicioServicio', [
  check('fecha', 'La fecha es obligatoria').not().isEmpty(),
  check('hora', 'La hora es obligatoria').not().isEmpty(),
  validarCampos
], inicioServicio )

router.put('/updateServicio/:id', [
  check('id', 'El ID del servicio es obligatorio').not().isEmpty(),
  validarCampos
], updateServicio);




module.exports = router