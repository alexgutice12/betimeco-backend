const router = require("express").Router();
const controlador = require("../controllers/product.controller");
const validarToken = require("../middlewares/auth.middleware");
const validar = require("../middlewares/validate.middleware");
const {
  idValidator,
  productValidator,
} = require("../validators/product.validator");
router.get("/", controlador.listar);
router.get("/mis-productos", validarToken, controlador.listarPropios);
router.get("/:id", idValidator, validar, controlador.detalle);
router.post("/", validarToken, productValidator, validar, controlador.crear);
router.put(
  "/:id",
  validarToken,
  idValidator,
  productValidator,
  validar,
  controlador.actualizar,
);
router.delete("/:id", validarToken, idValidator, validar, controlador.eliminar);
module.exports = router;
