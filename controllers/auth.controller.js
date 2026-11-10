const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const datosPublicos = usuario => ({ id: usuario._id.toString(), nombre: usuario.nombre, email: usuario.email });
const registrar = async (peticion, respuesta, next) => {
    try {
        const { nombre, email, password } = peticion.body;
        if (await User.exists({ email })) return respuesta.status(409).json({ msg: 'Este correo ya está registrado' });
        const usuario = await User.create({ nombre, email, password: await bcrypt.hash(password, 10) });
        respuesta.status(201).json({ msg: 'Cuenta creada. Ya puedes iniciar sesión', usuario: datosPublicos(usuario) });
    } catch (error) { next(error); }
};
const login = async (peticion, respuesta, next) => {
    try {
        const { email, password } = peticion.body;
        const usuario = await User.findOne({ email }).select('+password');
        if (!usuario || !await bcrypt.compare(password, usuario.password)) return respuesta.status(401).json({ msg: 'Correo o contraseña incorrectos' });
        const token = jwt.sign({ id: usuario._id.toString() }, process.env.SECRET_KEY, { expiresIn: '1h', algorithm: 'HS256' });
        respuesta.json({ token, usuario: datosPublicos(usuario) });
    } catch (error) { next(error); }
};
const perfil = (peticion, respuesta) => respuesta.json({ usuario: datosPublicos(peticion.user) });
module.exports = { registrar, login, perfil };
