const { Router } = require('express')
const { check } = require('express-validator')
const { userGET, userPOST, userPUT, getMisClientes } = require('../controllers/user.controller')
const { validarCampos } = require('../middlewares/validar-campos')
const { validateRole, emailExist, userExist, phoneExist, rucExist, codeExist } = require('../helpers/db-validators')
const { validarJWT } = require('../middlewares/validar-jwt')

const router = Router()

router.get('/',[
  validarJWT,
  validarCampos
], userGET)


router.get('/getContadoras',[
], userGET)

router.get('/getMisClientes',[
  validarJWT,
  validarCampos
], getMisClientes)

router.post('/', [
  check('nombre', 'El campo "nombre" es obligatorio').not().isEmpty(),
  check('contraseña', 'El campo "contraseña" debe ser mayor a 6 caracteres').isLength({ min: 6 }),
  check('correo', 'El campo "correo" no es válido').custom(emailExist),
  check('role', 'El campo "role" es obligatorio').not().isEmpty(),
  check('correo', 'El correo ya está en uso').custom(userExist),
  validarCampos
], userPOST);


router.put('/:id',[
  validarJWT,
  check('id', 'No es un ID válido').isMongoId(),
  validarCampos
], userPUT)



module.exports = router