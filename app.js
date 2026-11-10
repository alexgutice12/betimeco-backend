const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
app.disable('x-powered-by');
const origenes = (process.env.FRONTEND_ORIGIN || 'http://localhost:4200').split(',').map(valor => valor.trim());
app.use(cors({ origin: origenes }));
app.use(express.json({ limit: '20kb' }));
app.get('/api/estado', (peticion, respuesta) => {
    const conectado = mongoose.connection.readyState === 1;
    respuesta.status(conectado ? 200 : 503).json({ mensaje: 'El servidor de BeTimeCo está funcionando', mongodb: conectado ? 'conectado' : 'sin conexión' });
});
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/product', require('./routes/product.routes'));
app.use((peticion, respuesta) => respuesta.status(404).json({ msg: 'Ruta no encontrada' }));
app.use((error, peticion, respuesta, next) => {
    if (error.type === 'entity.parse.failed') return respuesta.status(400).json({ msg: 'El JSON enviado no es válido' });
    if (error.type === 'entity.too.large') return respuesta.status(413).json({ msg: 'La petición es demasiado grande' });
    if (error.code === 11000) return respuesta.status(409).json({ msg: 'Este dato ya está registrado' });
    if (error.name === 'ValidationError' || error.name === 'CastError') return respuesta.status(400).json({ msg: 'Los datos enviados no son válidos' });
    console.error('Error al atender la petición:', error.name);
    respuesta.status(500).json({ msg: 'No fue posible completar la operación. Inténtalo de nuevo' });
});
module.exports = app;
