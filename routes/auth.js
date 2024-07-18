const { Router } = require('express')
const { check } = require('express-validator')
const { login, refreshToken } = require('../controllers/auth.controller')
const { validarCampos } = require('../middlewares/validar-campos')


const router = Router()

router.post('/login', [
  check('correo', 'El username es obligatorio').not().isEmpty(),
  check('contraseña', 'La contraseña es obligatoria').not().isEmpty(),
  validarCampos
], login )

router.post('/refreshToken', [
  check('token', 'El token es obligatorio').not().isEmpty(),
  validarCampos
], refreshToken)


module.exports = router