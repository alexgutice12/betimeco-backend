const mongoose = require("mongoose");
const mensajeSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true, minlength: 3, maxlength: 80 },
    correo: { type: String, required: true, lowercase: true, trim: true, maxlength: 254 },
    mensaje: { type: String, required: true, trim: true, minlength: 10, maxlength: 2000 },
  },
  { timestamps: true, collection: "mensajes" },
);
module.exports = mongoose.model("Mensaje", mensajeSchema);
