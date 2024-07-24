const { PrestacionLegal } = require("../models/prestacion");

const createPrestacionLegal = async (req, res) => {
  try {
    const prestacionLegal = new PrestacionLegal(req.body);
    await prestacionLegal.save();
    res.status(201).json({
      status: "success",
      prestacionLegal,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al crear la prestación legal",
      errorMessage: error.message,
      stack: error.stack,
      error,
    });
  }
};

const getPrestacionesLegales = async (req, res) => {
  try {
    const prestacionesLegales = await PrestacionLegal.find();
    res.status(200).json({
      status: "success",
      cantidad: prestacionesLegales.length,
      prestacionesLegales,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al obtener las prestaciones legales",
      errorMessage: error.message,
      stack: error.stack,
      error,
    });
  }
};

const getPrestacionLegalById = async (req, res) => {
  try {
    const prestacionLegal = await PrestacionLegal.findById(req.params.id);
    if (!prestacionLegal) {
      return res.status(404).json({
        status: "error",
        message: "Prestación legal no encontrada",
      });
    }
    res.status(200).json({
      status: "success",
      prestacionLegal,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al obtener la prestación legal",
      errorMessage: error.message,
      stack: error.stack,
      error,
    });
  }
};

const updatePrestacionLegal = async (req, res) => {
  try {
    const prestacionLegal = await PrestacionLegal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!prestacionLegal) {
      return res
        .status(404)
        .json({ status: "error", message: "Prestación legal no encontrada" });
    }

    res.status(200).json({ status: "success", prestacionLegal });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al actualizar la prestación legal",
      error,
    });
  }
};

const deletePrestacionLegal = async (req, res) => {
  try {
    const prestacionLegal = await PrestacionLegal.findByIdAndDelete(
      req.params.id
    );
    if (!prestacionLegal) {
      return res.status(404).json({
        status: "error",
        message: "Prestación legal no encontrada",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Prestación legal eliminada",
      prestacionLegal,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al eliminar la prestación legal",
      errorMessage: error.message,
      stack: error.stack,
      error,
    });
  }
};

module.exports = {
  createPrestacionLegal,
  getPrestacionesLegales,
  getPrestacionLegalById,
  updatePrestacionLegal,
  deletePrestacionLegal,
};
