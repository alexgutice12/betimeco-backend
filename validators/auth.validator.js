const { body } = require("express-validator");
const email = () =>
  body("email")
    .isString()
    .withMessage("Escribe tu correo")
    .bail()
    .trim()
    .isLength({ max: 254 })
    .isEmail()
    .withMessage("Escribe un correo válido")
    .toLowerCase();
const registerValidator = [
  body("nombre")
    .isString()
    .withMessage("Escribe tu nombre")
    .bail()
    .trim()
    .isLength({ min: 3, max: 80 })
    .withMessage("El nombre debe tener entre 3 y 80 caracteres"),
  email(),
  body("password")
    .isString()
    .withMessage("Escribe una contraseña")
    .bail()
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      "Usa al menos 8 caracteres, mayúscula, minúscula, número y símbolo",
    )
    .custom((valor) => Buffer.byteLength(valor, "utf8") <= 72)
    .withMessage("La contraseña debe ocupar como máximo 72 bytes"),
];
const loginValidator = [
  email(),
  body("password")
    .isString()
    .withMessage("Escribe tu contraseña")
    .bail()
    .notEmpty()
    .withMessage("Escribe tu contraseña")
    .custom((valor) => Buffer.byteLength(valor, "utf8") <= 72)
    .withMessage("Contraseña demasiado larga"),
];
module.exports = { registerValidator, loginValidator };
