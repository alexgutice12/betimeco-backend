const mongoose = require("mongoose");
const Mensaje = require("../models/Mensaje");
const enviar = async (peticion, respuesta, next) => {
  if (mongoose.connection.readyState !== 1) {
    return respuesta.status(503).json({
      msg: "No podemos recibir mensajes en este momento. Inténtalo de nuevo más tarde",
    });
  }
  try {
    const { nombre, correo, mensaje } = peticion.body;
    await Mensaje.create({ nombre, correo, mensaje });
    respuesta.status(201).json({ msg: "Recibimos tu mensaje. Gracias por escribir a BeTimeCo." });
  } catch (error) {
    next(error);
  }
};
module.exports = { enviar };
