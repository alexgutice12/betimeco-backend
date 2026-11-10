const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    descripcion: { type: String, required: true, trim: true, maxlength: 1500 },
    precio: { type: Number, required: true, min: 1, max: 100000000 },
    stock: { type: Number, required: true, min: 0, max: 100000 },
    imagen: { type: String, default: "/img/reloj-hexa-negro.jpg" },
    categoria: {
      type: String,
      enum: ["Deportivo", "Clásico", "Urbano", "Elegante"],
      required: true,
    },
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);
module.exports = mongoose.model("Product", productSchema);
