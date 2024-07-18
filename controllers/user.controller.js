const { response, request } = require('express')
const bcryptjs = require('bcryptjs')
const  Usuario  = require('../models/user')
const { verificarUnicidad } = require('../helpers/verificarUnicidad')
const { findUser } = require('../helpers/findUser')

 
const userGET = async(req = request, res = response) => {
  const { limit = 5, from = 0} = req.query
  const usuarios = await Usuario.find()
    .skip(Number( from ))
    .limit(Number( limit ))


  res.json({ usuarios })
}

const getContadoras = async(req, res = response) => {
  try {
    const contadoras = await Usuario.find({ role: 'CONTADORA' });
    res.json({
      total: contadoras.length,
      usuarios: contadoras
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Error de Servidor'
    });
  }
};


const userPOST = async (req, res = response) => {
  const { role } = req.body;

  if (role === "CONTADORA") {
    const { nombre, correo, contraseña, experiencia } = req.body;

    if (!nombre || !correo || !contraseña || !experiencia) {
      return res.status(400).json({
        msg: 'Todos los campos son obligatorios.'
      });
    }

    try {
      const user = new Usuario({ nombre, correo, contraseña, role: "CONTADORA", experiencia });

      const salt = bcryptjs.genSaltSync();
      user.contraseña = bcryptjs.hashSync(contraseña, salt);

      await user.save();

      // Populate the newly created contadora without including 'clientes'
      const populatedUser = await Usuario.findById(user._id).populate({
        path: 'clientes',
        select: '-clientes -contraseña'
      }).exec();

      return res.json(populatedUser);

    } catch (error) {
      console.log(error);
      res.status(500).json({
        msg: 'Error de Servidor'
      });
    }
  }

  if (role === "CLIENTE") {
    const { nombre, correo, contraseña, apllido_materno, apllido_paterno, dni, celular } = req.body;

    if (!nombre || !correo || !contraseña || !apllido_materno || !apllido_paterno || !dni || !celular) {
      return res.status(400).json({
        msg: 'Todos los campos son obligatorios.'
      });
    }

    try {
      // Usar una consulta agregada para encontrar la contadora con menos clientes
      const contadoras = await Usuario.aggregate([
        { $match: { role: 'CONTADORA' } },
        {
          $lookup: {
            from: 'usuarios',
            localField: '_id',
            foreignField: 'contadora',
            as: 'clientes'
          }
        },
        {
          $addFields: {
            numClientes: { $size: '$clientes' }
          }
        },
        {
          $sort: { numClientes: 1 }
        },
        {
          $limit: 1
        }
      ]);

      if (contadoras.length === 0) {
        return res.status(400).json({
          msg: 'No hay contadoras disponibles.'
        });
      }

      const contadora = contadoras[0];

      const user = new Usuario({ nombre, correo, contraseña, apllido_materno, apllido_paterno, dni, celular, role: "CLIENTE", contadora: contadora._id });

      const salt = bcryptjs.genSaltSync();
      user.contraseña = bcryptjs.hashSync(contraseña, salt);

      await user.save();

      // Añadir el cliente a la lista de clientes de la contadora
      await Usuario.findByIdAndUpdate(contadora._id, { $push: { clientes: user._id } });

      // Populate the contadora field of the client excluding 'clientes' and 'contraseña'
      const populatedUser = await Usuario.findById(user._id).populate({
        path: 'contadora',
        select: '-clientes -contraseña'
      }).exec();

      return res.json(populatedUser);

    } catch (error) {
      console.log(error);
      res.status(500).json({
        msg: 'Error de Servidor'
      });
    }
  }
};


const userPUT = async(req, res = response) => {
  const id = req.params.id
  let { _id, password, email, username, phone, ...rest} = req.body

  //Verifica que los Datos no existan ya 

  try {
    const errorMessage = await verificarUnicidad( { email, username, phone, id } );
    if (errorMessage) {
      return res.status(400).json({
        msg: errorMessage
      });
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      msg: 'Error al verificar unicidad de los datos',
      error
    });
  }

  if (password) {
    const salt = bcryptjs.genSaltSync();
    password = bcryptjs.hashSync(password, salt);
  }

  // Preparar el objeto con los datos actualizados, incluyendo correo, username, phone y password si se ha proporcionado
  const datosActualizados = {
    ...rest,
    ...(email && {email}),
    ...(username && {username}),
    ...(phone && {phone}),
    ...(password && {password})
  };

  try {
    const usuario = await Usuario.findByIdAndUpdate(id, datosActualizados, { new: true });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({
      msg: 'Error al actualizar usuario',
      error
    });
  }

}

const getMisClientes = async (req, res = response) => {
  const JWT = req.headers.access_token;
  let user;

  try {
    user = await findUser(JWT);
  } catch (error) {
    return res.status(401).json({
      msg: 'Token inválido'
    });
  }

  try {
    // Obteniendo los clientes del usuario
    const clienteIds = user.clientes;

    // Buscando los detalles completos de los clientes en la base de datos
    const clientes = await Usuario.find({ _id: { $in: clienteIds } });

    res.json({
      total: clientes.length,
      clientes
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Error de Servidor'
    });
  }
};

const createAdminUser = async (req, res = response) => {
  const { correo, contraseña } = req.body;

  if (!correo || !contraseña) {
    return res.status(400).json({
      msg: 'Usuario y contraseña son obligatorios.'
    });
  }

  try {
    // Crear un nuevo usuario con el rol "ADMIN"
    const newUser = new Usuario({ correo, contraseña, role: "ADMIN" });

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    newUser.contraseña = bcryptjs.hashSync(contraseña, salt);

    // Guardar el nuevo usuario en la base de datos
    await newUser.save();

    // Responder con el nuevo usuario (sin la contraseña)
    const { contraseña: _, ...userWithoutPassword } = newUser.toObject();
    res.json(userWithoutPassword);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Error de Servidor'
    });
  }
};


module.exports = {
  userGET,
  userPOST,
  userPUT,
  getContadoras,
  getMisClientes,
  createAdminUser
}