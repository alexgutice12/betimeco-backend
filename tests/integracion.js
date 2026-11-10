require("dotenv").config({ quiet: true });
const assert = require("node:assert/strict");
const { randomBytes } = require("node:crypto");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

// Las pruebas crean una base temporal propia; nunca usan la base betimeco.
const baseTemporal =
  "betimeco_pruebas_" + Date.now() + "_" + randomBytes(3).toString("hex");
const uri = new URL(process.env.MONGO_URI);
uri.pathname = "/" + baseTemporal;
process.env.MONGO_URI = uri.toString();
const app = require("../app");
const conectar = require("../config/db");
const User = require("../models/User");
const Product = require("../models/Product");

const ejecutar = async () => {
  let servidor;
  let comprobaciones = 0;
  const estado = (resultado, esperado) => {
    assert.equal(resultado.status, esperado);
    comprobaciones++;
  };
  try {
    await conectar();
    await User.init();
    servidor = app.listen(0, "127.0.0.1");
    await new Promise((resolve) => servidor.once("listening", resolve));
    const url = "http://127.0.0.1:" + servidor.address().port + "/api";
    const pedir = async (ruta, metodo = "GET", cuerpo, token) => {
      const respuesta = await fetch(url + ruta, {
        method: metodo,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: "Bearer " + token } : {}),
        },
        ...(cuerpo === undefined ? {} : { body: JSON.stringify(cuerpo) }),
      });
      return { status: respuesta.status, data: await respuesta.json() };
    };
    estado(await pedir("/estado"), 200);
    estado(
      await pedir("/auth/registrar", "POST", {
        nombre: "a",
        email: "incorrecto",
        password: "123",
      }),
      400,
    );
    const cuenta = {
      nombre: "Cuenta de prueba",
      email: "prueba@example.com",
      password: "ClaveTemporal!29",
    };
    const registro = await pedir("/auth/registrar", "POST", cuenta);
    estado(registro, 201);
    assert.equal(registro.data.usuario.password, undefined);
    const guardado = await User.findOne({ email: cuenta.email }).select(
      "+password",
    );
    assert.notEqual(guardado.password, cuenta.password);
    estado(await pedir("/auth/registrar", "POST", cuenta), 409);
    estado(
      await pedir("/auth/login", "POST", {
        email: cuenta.email,
        password: "incorrecta",
      }),
      401,
    );
    const acceso = await pedir("/auth/login", "POST", cuenta);
    estado(acceso, 200);
    const token = acceso.data.token;
    estado(await pedir("/auth/perfil"), 401);
    estado(await pedir("/auth/perfil", "GET", undefined, "invalido"), 401);
    const vencido = jwt.sign(
      { id: registro.data.usuario.id },
      process.env.SECRET_KEY,
      { expiresIn: -1 },
    );
    estado(await pedir("/auth/perfil", "GET", undefined, vencido), 401);
    estado(await pedir("/auth/perfil", "GET", undefined, token), 200);
    const producto = {
      nombre: "Hexa de prueba",
      descripcion: "Reloj creado únicamente durante las pruebas.",
      precio: 189900,
      stock: 4,
      categoria: "Deportivo",
      imagen: "/img/reloj-hexa-negro.jpg",
    };
    estado(await pedir("/product", "POST", producto), 401);
    estado(
      await pedir("/product", "POST", { ...producto, precio: -10 }, token),
      400,
    );
    const creado = await pedir(
      "/product",
      "POST",
      { ...producto, usuario: "000000000000000000000000" },
      token,
    );
    estado(creado, 201);
    assert.equal(creado.data.usuario, registro.data.usuario.id);
    const id = creado.data._id;
    estado(await pedir("/product"), 200);
    estado(await pedir("/product/mis-productos", "GET", undefined, token), 200);
    estado(await pedir("/product/" + id), 200);
    estado(await pedir("/product/no-es-un-id"), 400);
    estado(await pedir("/product/000000000000000000000000"), 404);
    await pedir("/auth/registrar", "POST", {
      ...cuenta,
      email: "otra@example.com",
    });
    const otra = await pedir("/auth/login", "POST", {
      ...cuenta,
      email: "otra@example.com",
    });
    estado(
      await pedir("/product/" + id, "PUT", producto, otra.data.token),
      404,
    );
    estado(
      await pedir("/product/" + id, "DELETE", undefined, otra.data.token),
      404,
    );
    const editado = await pedir(
      "/product/" + id,
      "PUT",
      { ...producto, precio: 199900, stock: 2 },
      token,
    );
    estado(editado, 200);
    assert.equal(editado.data.precio, 199900);
    assert.equal(editado.data.stock, 2);
    const buscarOriginal = Product.find;
    Product.find = () => {
      throw new Error("Fallo simulado de base de datos");
    };
    try {
      estado(await pedir("/product"), 500);
    } finally {
      Product.find = buscarOriginal;
    }
    estado(await pedir("/product/" + id, "DELETE", undefined, token), 200);
    estado(await pedir("/product/" + id), 404);
    estado(await pedir("/no-existe"), 404);
    console.log(
      "Pruebas correctas: " +
        comprobaciones +
        " comprobaciones HTTP, contraseña protegida y aislamiento entre cuentas.",
    );
  } finally {
    if (servidor) await new Promise((resolve) => servidor.close(resolve));
    if (mongoose.connection.readyState === 1) {
      assert.equal(mongoose.connection.name, baseTemporal);
      await mongoose.connection.db.dropDatabase();
    }
    await mongoose.disconnect();
  }
};
ejecutar().catch((error) => {
  console.error(
    "Prueba fallida:",
    error.name,
    error instanceof assert.AssertionError
      ? error.message
      : "Revisa la conexión o el servidor",
  );
  process.exitCode = 1;
});
