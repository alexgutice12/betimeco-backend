const jwt = require('jsonwebtoken');
const User = require('../models/User');
module.exports = async (peticion, respuesta, next) => {
    const partes = (peticion.get('Authorization') || '').split(' ');
    if (partes.length !== 2 || partes[0] !== 'Bearer' || !partes[1]) return respuesta.status(401).json({ msg: 'Inicia sesión para continuar' });
    let datos;
    try {
        datos = jwt.verify(partes[1], process.env.SECRET_KEY, { algorithms: ['HS256'] });
        if (typeof datos.id !== 'string' || !/^[a-f\d]{24}$/i.test(datos.id)) return respuesta.status(401).json({ msg: 'La sesión no es válida' });
    } catch { return respuesta.status(401).json({ msg: 'La sesión venció o no es válida. Vuelve a ingresar' }); }
    try {
        const usuario = await User.findById(datos.id);
        if (!usuario) return respuesta.status(401).json({ msg: 'La cuenta ya no está disponible' });
        peticion.user = usuario;
        next();
    } catch (error) { next(error); }
};
