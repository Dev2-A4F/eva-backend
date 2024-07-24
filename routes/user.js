const { Router } = require('express')
const { check } = require('express-validator')
const { userPOST, getMisClientes, createAdminUser, getContadoras, getMiContadora, getContadoraById } = require('../controllers/user.controller')
const { validarCampos } = require('../middlewares/validar-campos')
const { validateRole, emailExist, userExist, phoneExist, rucExist, codeExist } = require('../helpers/db-validators')
const { validarJWT } = require('../middlewares/validar-jwt')

const router = Router()


router.get('/getContadoras',[
], getContadoras)

router.get('/getMisClientes/:id',[
], getMisClientes)

router.get('/getMiContadora',[
  validarJWT,
  validarCampos
], getMiContadora)

router.get('/getContadoraById/:id',[
  check('id', 'El campo "id" es obligatorio').not().isEmpty(),
  check('id', 'No es un ID válido').isMongoId(),
], getContadoraById)

router.post('/', [
  check('nombre', 'El campo "nombre" es obligatorio').not().isEmpty(),
  check('contraseña', 'El campo "contraseña" debe ser mayor a 6 caracteres').isLength({ min: 6 }),
  check('correo', 'El campo "correo" no es válido').custom(emailExist),
  check('role', 'El campo "role" es obligatorio').not().isEmpty(),
  check('correo', 'El correo ya está en uso').custom(userExist),
  validarCampos
], userPOST);


router.post('/createAdminUser', [
  check('nombre', 'El campo "nombres" es obligatorio').not().isEmpty(),
  check('correo', 'El campo "correo" es obligatorio').not().isEmpty(),
  check('contraseña', 'El campo "contraseña" debe ser mayor a 6 caracteres').isLength({ min: 6 }),
  validarCampos
], createAdminUser);







module.exports = router