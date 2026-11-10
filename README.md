# Backend de BeTimeCo

Backend Express con conexión a MongoDB Atlas mediante Mongoose. La autenticación y los productos todavía no están implementados. Este punto de partida se preparó con asistencia de Codex; Alex debe comprenderlo y seguir la exigencia de escritura manual indicada por su profesor para su entrega.

La carpeta de trabajo es `G:\Mi unidad\BIT Bootcamp Desarrollo Web Full Stack\betimeco-backend`. El proyecto completo, incluyendo Git, configuración local y paquetes instalados, se trasladó a Google Drive y se comprobó que el servidor responde desde esta ubicación. La carpeta anterior en `C:\Users\Alexa\source\betimeco-backend` se conserva como respaldo y no se actualiza automáticamente. Continúa trabajando en la carpeta de Google Drive.

## Ejecutarlo

Abre esta carpeta en Visual Studio Code. En su terminal PowerShell:

```powershell
npm.cmd install
Copy-Item .env.example .env
npm.cmd run dev
```

Si `.env` ya existe, conserva ese archivo y omite el comando Copy-Item.
Abre http://localhost:3000/api/estado. Debes recibir una respuesta JSON con el mensaje de funcionamiento y `mongodb: "conectado"`. Para detener el servidor, pulsa Ctrl+C en esa terminal.

La conexión privada ya se configuró en `.env`. No reemplaces ese archivo con `.env.example`: el ejemplo sólo contiene datos ficticios. Para otra instalación, configura MONGO_URI con los datos de Atlas.

## Conexión a MongoDB paso a paso

1. Atlas aloja el clúster gratuito BeTimeCo; la aplicación utiliza la base lógica `betimeco`.
2. `.env` guarda PORT y MONGO_URI. La URI indica el servidor de Atlas y contiene el usuario y la contraseña de la base de datos. Esa cuenta es distinta de la cuenta con la que entras al sitio de Atlas.
3. dotenv carga esos valores en `process.env` al iniciar `index.js`.
4. `require('./config/db')` importa la función de conexión, siguiendo la estructura del profesor.
5. En `config/db.js`, `await mongoose.connect(process.env.MONGO_URI)` espera a que termine la conexión. `async` permite usar `await` dentro de esa función.
6. El comando `ping` comprueba que MongoDB responde. No inserta productos ni usuarios.
7. Sólo después de conectar, `app.listen` abre el servidor HTTP.
8. `/api/estado` devuelve 200 si Mongoose indica conexión activa y 503 si perdió la conexión. Esta comprobación no sustituye el manejo de errores de las futuras operaciones CRUD.

La base `betimeco` puede no aparecer todavía en el explorador de Atlas: MongoDB la materializa al crear una colección o guardar los primeros datos. Conectar y guardar son pasos distintos.

Si falla, comprueba en Atlas el usuario de base de datos, su contraseña y la IP permitida. No compartas ni subas `.env`; Git lo ignora. No es necesario instalar MongoDB Community para utilizar Atlas.

En este equipo, el DNS predeterminado devolvió ECONNREFUSED al consultar los registros SRV de Atlas. Se configuró `DNS_SERVERS=1.1.1.1,8.8.8.8` en `.env`; `config/db.js` aplica esos servidores sólo al proceso Node mediante `dns.setServers`. No se cambió el DNS de Windows. El ajuste es opcional en otros equipos.

Si Google Drive produce errores de escritura al instalar paquetes, no continúes con una instalación incompleta: instala con el mismo package.json y package-lock.json en una carpeta local y copia los paquetes ya instalados a node_modules en Drive. En esta sesión se utilizó ese procedimiento para Mongoose.

`npm.cmd` es la versión de npm que podemos ejecutar desde PowerShell sin cambiar su política de scripts. `npm run dev` también sirve en terminales que permiten npm directamente.

## Qué acabamos de crear

- Node.js ejecuta JavaScript fuera del navegador.
- Express permite crear el servidor y sus rutas.
- Una ruta es una dirección que nuestro servidor reconoce, como `/api/estado`.
- GET solicita información. El navegador hace esta petición al abrir la dirección.
- JSON es el formato de los datos de la respuesta: un objeto con propiedades y valores.
- El puerto 3000 identifica dónde escucha esta aplicación en tu computadora.
- nodemon reinicia el servidor cuando guardas cambios en el código.
- `.env` contiene configuración local. `.env.example` muestra qué configuración hace falta sin compartir secretos.
- `node_modules` contiene los paquetes instalados; `package-lock.json` registra sus versiones para reproducir la instalación.

## Leer index.js en orden

1. `require('dotenv').config(...)` carga la configuración local.
2. `require('express')` importa la biblioteca; `express()` crea la aplicación.
3. `app.use(express.json())` permite interpretar un cuerpo JSON.
4. `app.get(...)` registra la dirección de comprobación. `peticion` contiene lo que pide el cliente; `respuesta` permite contestar.
5. `respuesta.status(200).json(...)` contesta con el estado 200 y datos JSON.
6. El siguiente `app.use` devuelve 404 si ninguna ruta coincidió.
7. El middleware de errores tiene cuatro parámetros y devuelve 400 para JSON inválido o 500 para un error inesperado.
8. `iniciarServidor()` espera a `dbConnection()` y después ejecuta `app.listen(...)` para iniciar la escucha local.

## Organización del profesor

```text
betimeco-backend/
  index.js
  config/
  controllers/
  middlewares/
  models/
  routes/
  validators/
```

`config/db.js` contiene la conexión. Las demás carpetas todavía contienen únicamente `.gitkeep`, un archivo vacío que permite guardarlas en Git. Iremos añadiendo su código cuando lo expliquemos.

| Carpeta | Uso que tendrá |
| --- | --- |
| config | Conexión de MongoDB |
| models | Esquemas User y Product |
| routes | Direcciones de autenticación y productos |
| validators | Reglas de los datos recibidos |
| middlewares | Comprobación de JWT y resultados de validación |
| controllers | Funciones que registran, autentican y gestionan productos |

## Práctica antes de avanzar

1. Ejecuta el servidor y abre `/api/estado`.
2. Cambia el mensaje del objeto JSON en `index.js`, guarda y actualiza el navegador.
3. Abre `/api/no-existe` y observa la respuesta 404.
4. Explica con tus palabras qué hacen `app.get` y `respuesta.json`.

## Próximas etapas

1. Crear User, registro y sus validaciones.
2. Añadir bcrypt, login y JWT.
3. Crear Product y su CRUD con permisos.
4. Probar las peticiones en Postman y conectar Angular.

El proyecto utiliza Git con rama principal main. Cada avance funcional se guarda con un mensaje que describe el cambio. Los siguientes trabajos de registro, login y productos se desarrollarán en ramas propias antes de integrarse en main.
