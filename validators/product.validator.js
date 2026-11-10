const { body, param } = require("express-validator");
const idValidator = [
  param("id")
    .isMongoId()
    .withMessage("El identificador del producto no es válido"),
];
const productValidator = [
  body("nombre")
    .isString()
    .withMessage("Escribe el nombre")
    .bail()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("El nombre debe tener entre 3 y 100 caracteres"),
  body("descripcion")
    .isString()
    .withMessage("Escribe la descripción")
    .bail()
    .trim()
    .isLength({ min: 10, max: 1500 })
    .withMessage("La descripción debe tener entre 10 y 1500 caracteres"),
  body("precio")
    .isFloat({ min: 1, max: 100000000 })
    .withMessage("El precio debe estar entre $1 y $100.000.000")
    .toFloat(),
  body("stock")
    .isInt({ min: 0, max: 100000 })
    .withMessage("Las existencias deben ser un entero entre 0 y 100.000")
    .toInt(),
  body("categoria")
    .isIn(["Deportivo", "Clásico", "Urbano", "Elegante"])
    .withMessage("Selecciona una categoría válida"),
  body("imagen")
    .optional()
    .isString()
    .bail()
    .isLength({ max: 1000 })
    .bail()
    .custom(
      (valor) =>
        /^\/img\/[a-z\d-]+\.(jpg|png|webp)$/i.test(valor) ||
        (/^https:\/\//i.test(valor) && URL.canParse(valor)),
    )
    .withMessage("Usa una imagen de la colección o una dirección HTTPS válida"),
];
module.exports = { idValidator, productValidator };
