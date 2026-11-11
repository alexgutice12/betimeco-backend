const router = require("express").Router();
const { rateLimit } = require("express-rate-limit");
const { enviar } = require("../controllers/contact.controller");
const validarContacto = require("../validators/contact.validator");
const validar = require("../middlewares/validate.middleware");
const limite = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { msg: "Has enviado varios mensajes. Espera unos minutos antes de volver a intentarlo" },
});
router.post("/", limite, validarContacto, validar, enviar);
module.exports = router;
