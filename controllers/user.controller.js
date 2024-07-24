const { response, request } = require('express')
const bcryptjs = require('bcryptjs')
const  Usuario  = require('../models/user')
const  Servicio  = require('../models/servicio')
const { findUser } = require('../helpers/findUser')
const cloudinary = require('../config/cloudinary');



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
    const { nombre, correo, contraseña, experiencia, fecha_nacimiento, imgContadora, especialidad } = req.body;

    if (!nombre || !correo || !contraseña || !experiencia || !fecha_nacimiento || !imgContadora || !especialidad) {
      return res.status(400).json({
        msg: 'Todos los campos son obligatorios.'
      });
    }

    try {
      // Subir imagen a Cloudinary
      const uploadResponse = await cloudinary.uploader.upload(imgContadora, {
        folder: 'contadoras', // Puedes cambiar el folder según tu estructura
      });

      const user = new Usuario({
        nombre,
        correo,
        contraseña,
        role: "CONTADORA",
        experiencia,
        fecha_nacimiento,
        imgContadora: uploadResponse.secure_url, // Guardar URL de la imagen subida
        especialidad
      });

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

      const user = new Usuario({
        nombre,
        correo,
        contraseña,
        apllido_materno,
        apllido_paterno,
        dni,
        celular,
        role: "CLIENTE",
        contadora: contadora._id
      });

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


const getMisClientes = async (req, res = response) => {
  const id = req.params.id;  // Recibe el ID desde los parámetros de la URL

  try {
    // Buscar el usuario por ID en la base de datos
    const user = await Usuario.findById(id);
    
    if (!user) {
      return res.status(404).json({
        msg: 'Usuario no encontrado'
      });
    }

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

const getMiContadora = async (req, res = response) => {
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
    const contadora = user.contadora;

    // Buscando los detalles completos de los clientes en la base de datos
    const clientes = await Usuario.find({ _id: contadora });

    res.json({
      clientes
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Error de Servidor'
    });
  }
};

const getContadoraById = async (req, res = response) => {
  const contadoraId = req.params.id;

  try {
    // Obteniendo la contadora por ID
    const contadora = await Usuario.findById(contadoraId);

    if (!contadora) {
      return res.status(404).json({
        msg: 'Contadora no encontrada'
      });
    }

    // Obteniendo los IDs de los clientes asociados a la contadora
    const clienteIds = contadora.clientes;

    // Buscando los detalles completos de los clientes en la base de datos
    const clientes = await Usuario.find({ _id: { $in: clienteIds } });

    // Agregando la información completa del servicioCliente si existe
    const clientesConServicios = await Promise.all(clientes.map(async (cliente) => {
      if (cliente.servicioCliente) {
        const servicio = await Servicio.findById(cliente.servicioCliente);
        return { ...cliente.toObject(), servicioCliente: servicio };
      }
      return cliente.toObject();
    }));

    res.json({
      contadora: {
        ...contadora.toObject(),
        clientes: clientesConServicios
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Error de Servidor'
    });
  }
};


module.exports = {
  userPOST,
  getContadoras,
  getMisClientes,
  createAdminUser,
  getMiContadora,
  getContadoraById
}