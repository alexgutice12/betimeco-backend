const { body } = require("express-validator");
module.exports = [
  body("nombre").isString().withMessage("Escribe tu nombre").bail().trim()
    .isLength({ min: 3, max: 80 }).withMessage("El nombre debe tener entre 3 y 80 caracteres"),
  body("correo").isString().withMessage("Escribe tu correo").bail().trim()
    .isLength({ max: 254 }).isEmail().withMessage("Escribe un correo válido").toLowerCase(),
  body("mensaje").isString().withMessage("Escribe un mensaje").bail().trim()
    .isLength({ min: 10, max: 2000 }).withMessage("El mensaje debe tener entre 10 y 2000 caracteres"),
];
