const Product = require('../models/Product');
const camposProducto = cuerpo => ({ nombre: cuerpo.nombre, descripcion: cuerpo.descripcion,
    precio: cuerpo.precio, stock: cuerpo.stock, imagen: cuerpo.imagen, categoria: cuerpo.categoria });
const listar = async (peticion, respuesta, next) => {
    try { respuesta.json(await Product.find().sort({ createdAt: -1 }).limit(200)); }
    catch (error) { next(error); }
};
const listarPropios = async (peticion, respuesta, next) => {
    try { respuesta.json(await Product.find({ usuario: peticion.user._id }).sort({ createdAt: -1 }).limit(200)); }
    catch (error) { next(error); }
};
const detalle = async (peticion, respuesta, next) => {
    try {
        const producto = await Product.findById(peticion.params.id);
        if (!producto) return respuesta.status(404).json({ msg: 'El producto no existe' });
        respuesta.json(producto);
    } catch (error) { next(error); }
};
const crear = async (peticion, respuesta, next) => {
    try {
        const producto = await Product.create({ ...camposProducto(peticion.body), usuario: peticion.user._id });
        respuesta.status(201).json(producto);
    } catch (error) { next(error); }
};
const actualizar = async (peticion, respuesta, next) => {
    try {
        const producto = await Product.findOneAndUpdate({ _id: peticion.params.id, usuario: peticion.user._id },
            { $set: camposProducto(peticion.body) }, { returnDocument: 'after', runValidators: true });
        if (!producto) return respuesta.status(404).json({ msg: 'El producto no existe o no pertenece a tu cuenta' });
        respuesta.json(producto);
    } catch (error) { next(error); }
};
const eliminar = async (peticion, respuesta, next) => {
    try {
        const producto = await Product.findOneAndDelete({ _id: peticion.params.id, usuario: peticion.user._id });
        if (!producto) return respuesta.status(404).json({ msg: 'El producto no existe o no pertenece a tu cuenta' });
        respuesta.json({ msg: 'Producto eliminado' });
    } catch (error) { next(error); }
};
module.exports = { listar, listarPropios, detalle, crear, actualizar, eliminar };
