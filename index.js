// Carga los valores de .env, por ejemplo el puerto del servidor.
require('dotenv').config({ quiet: true });

// Importa Express y crea nuestra aplicación.
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dbConnection = require('./config/db');

// Permite recibir datos en formato JSON en las próximas etapas.
app.use(express.json());

// Una petición GET a /api/estado comprueba que el servidor responde.
app.get('/api/estado', (peticion, respuesta) => {
    const conectado = mongoose.connection.readyState === 1;

    respuesta.status(conectado ? 200 : 503).json({
        mensaje: 'El servidor de BeTimeCo está funcionando',
        mongodb: conectado ? 'conectado' : 'sin conexión'
    });
});

// Responde cuando la dirección solicitada no existe.
app.use((peticion, respuesta) => {
    respuesta.status(404).json({ mensaje: 'Ruta no encontrada' });
});

// Gestiona JSON mal formado y errores inesperados sin mostrar detalles internos.
app.use((error, peticion, respuesta, next) => {
    if (error.type === 'entity.parse.failed') {
        return respuesta.status(400).json({ mensaje: 'El JSON enviado no es válido' });
    }

    console.error('Ocurrió un error al atender la petición');
    respuesta.status(500).json({ mensaje: 'Error interno del servidor' });
});

// Usa PORT de .env; si no existe, utiliza 3000.
const PORT = Number(process.env.PORT || 3000);

if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
    console.error('PORT debe ser un número entre 1 y 65535');
    process.exit(1);
}

const iniciarServidor = async () => {
    try {
        // Primero conecta la base de datos; después abre el servidor HTTP.
        await dbConnection();

        const servidor = app.listen(PORT, '127.0.0.1', () => {
            console.log(`BeTimeCo disponible en http://localhost:${PORT}/api/estado`);
        });

        servidor.on('error', async (error) => {
            console.error(error.code === 'EADDRINUSE'
                ? `El puerto ${PORT} está ocupado. Usa otro PORT en .env.`
                : 'No fue posible iniciar el servidor');
            await mongoose.disconnect();
            process.exit(1);
        });
    } catch (error) {
        // No imprimimos la URI ni las credenciales en la terminal.
        console.error('No se pudo conectar con MongoDB Atlas. Revisa MONGO_URI, el usuario y el acceso de red en Atlas.');
        await mongoose.disconnect();
        process.exitCode = 1;
    }
};

iniciarServidor();
