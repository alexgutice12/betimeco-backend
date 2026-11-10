# Backend de BeTimeCo

API de la colección de relojes de BeTimeCo, con registro, login y gestión de productos. Usa Node.js, Express, Mongoose, JWT, bcrypt y express-validator.

## Ejecutarlo

En una terminal, dentro de esta carpeta:

```powershell
npm.cmd install
npm.cmd run dev
```

En este equipo el archivo .env ya está configurado. En otra instalación, copia .env.example a .env y completa MONGO_URI y SECRET_KEY. No reemplaces un .env existente. SECRET_KEY debe tener al menos 32 caracteres aleatorios. FRONTEND_ORIGIN contiene el origen de Angular, por defecto http://localhost:4200.

El servidor espera a que Atlas responda antes de escuchar en el puerto 3000. GET http://localhost:3000/api/estado muestra la conexión. No publiques .env ni credenciales.

## Organización

- index.js carga la configuración, conecta MongoDB e inicia el servidor.
- app.js configura Express, CORS, las rutas y los errores.
- config/db.js conecta con Atlas.
- models/User.js y Product.js definen los dos modelos.
- routes/ asocia direcciones con validadores, middleware y controladores.
- validators/ comprueba los datos de entrada.
- middlewares/ valida el formulario y verifica el JWT.
- controllers/ ejecuta el registro, login y CRUD.

Se mantiene la estructura de carpetas del profesor. app.js se separó de index.js para probar la API sin arrancar un segundo servidor en el puerto habitual.

## Endpoints

| Método | Dirección | Uso | Sesión |
| --- | --- | --- | --- |
| GET | /api/estado | Estado de conexión | No |
| POST | /api/auth/registrar | Nombre, email y password | No |
| POST | /api/auth/login | Email y password; devuelve token y usuario | No |
| GET | /api/auth/perfil | Datos de la cuenta actual | Sí |
| GET | /api/product | Catálogo, hasta 200 productos | No |
| GET | /api/product/:id | Detalle de un producto | No |
| GET | /api/product/mis-productos | Productos de la cuenta actual | Sí |
| POST | /api/product | Crear un producto | Sí |
| PUT | /api/product/:id | Editar todos sus datos | Sí, propietario |
| DELETE | /api/product/:id | Eliminar un producto | Sí, propietario |

Para las rutas protegidas usa Authorization: Bearer TOKEN. El token dura una hora. El propietario se obtiene del JWT y se comprueba en la base; no se acepta desde el formulario.

El catálogo es público. Cada cuenta administra únicamente los productos que creó: es el alcance de esta versión académica, no un sistema con roles de administración de una tienda en producción.

Los productos tienen nombre, descripción, precio en COP, stock entero, categoría e imagen. Las categorías son Deportivo, Clásico, Urbano y Elegante. Se permite seleccionar las imágenes de /img o una URL HTTPS.

## Respuestas y validaciones

- 200: consulta, login, edición o eliminación completada.
- 201: cuenta o producto creado.
- 400: datos, identificador o JSON inválidos; errors incluye campo y mensaje, sin contraseñas.
- 401: credenciales incorrectas o token ausente, inválido o vencido.
- 404: ruta o producto inexistente; también cuando se intenta modificar un producto ajeno, para no revelar su propietario.
- 409: correo ya registrado.
- 413: petición demasiado grande.
- 429: demasiados intentos de registro o login.
- 500: fallo interno inesperado, sin mostrar detalles privados.
- 503: la conexión a MongoDB no está disponible en la consulta de estado.

502 corresponde a un fallo de pasarela hacia otro servidor; no es una validación de formularios y no se fuerza mediante un endpoint artificial.

## Pruebas

```powershell
npm.cmd test
```

Las pruebas crean una base temporal de nombre betimeco_pruebas_..., comprueban 25 respuestas HTTP, bcrypt y aislamiento entre cuentas y eliminan exclusivamente esa base al terminar. No usan los documentos de betimeco. Incluyen un fallo simulado para verificar la respuesta 500.

Importa postman/BeTimeCo.postman_collection.json en Postman y ejecuta las peticiones en orden. El login guarda token y la creación de producto guarda productId automáticamente. La colección usa datos ficticios para practicar; no contiene las credenciales de Atlas.

## Datos de demostración

```powershell
npm.cmd run demo
```

Crea una cuenta de demostración y seis relojes sólo si aún no existen. No cambia contraseñas de cuentas existentes. Su correo y contraseña se guardan localmente como DEMO_EMAIL y DEMO_PASSWORD en .env. No publiques ese archivo ni lo muestres en el vídeo. El carrito del frontend guarda una selección; no cobra, crea pedidos ni reserva stock.

## Nota de trabajo

El código se desarrolló con asistencia de Codex. La guía del curso exige escritura manual y comprensión del código para la entrega; esta versión no debe describirse como un trabajo realizado sin esa ayuda. Alex debe revisar y poder explicar las funciones que presente.

En esta máquina se usa DNS_SERVERS en .env porque el DNS predeterminado no resolvía los registros SRV de Atlas. Es opcional y sólo modifica la resolución del proceso Node, no la de Windows. Los paquetes se instalaron en disco local y se copiaron a Drive después de errores de escritura de npm en la unidad virtual.
