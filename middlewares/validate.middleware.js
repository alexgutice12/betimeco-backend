const { validationResult } = require('express-validator');
module.exports = (peticion, respuesta, next) => {
    const errores = validationResult(peticion);
    if (!errores.isEmpty()) {
        return respuesta.status(400).json({
            msg: 'Revisa los datos del formulario',
            errors: errores.array({ onlyFirstError: true }).map(error => ({ path: error.path, msg: error.msg }))
        });
    }
    next();
};
