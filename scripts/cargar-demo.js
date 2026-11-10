require("dotenv").config({ quiet: true });
const fs = require("node:fs");
const crypto = require("node:crypto");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const conectar = require("../config/db");
const User = require("../models/User");
const Product = require("../models/Product");

const cargar = async () => {
  await conectar();
  const email = process.env.DEMO_EMAIL || "demo@betimeco.local";
  let usuario = await User.findOne({ email });
  if (!usuario) {
    const password = crypto.randomBytes(15).toString("base64url") + "Aa!8";
    usuario = await User.create({
      nombre: "Demo BeTimeCo",
      email,
      password: await bcrypt.hash(password, 10),
    });
    fs.appendFileSync(
      ".env",
      "\nDEMO_EMAIL=" + email + "\nDEMO_PASSWORD=" + password + "\n",
    );
  }
  const productos = [
    [
      "Hexa Black",
      "Reloj deportivo negro con caja geométrica y correa de silicona.",
      189900,
      8,
      "Deportivo",
      "reloj-hexa-negro.jpg",
    ],
    [
      "Hexa Orange",
      "Un diseño urbano de caja geométrica con correa naranja.",
      194900,
      6,
      "Urbano",
      "reloj-hexa-naranja.jpg",
    ],
    [
      "Hexa Silver",
      "Reloj de acabado plateado para combinar con tus prendas de cada día.",
      199900,
      5,
      "Clásico",
      "reloj-hexa-plateado.jpg",
    ],
    [
      "Kripton Rose",
      "Esfera en tono rosado y correa café para un estilo elegante.",
      219900,
      4,
      "Elegante",
      "reloj-kripton-rose.jpg",
    ],
    [
      "Gear Black",
      "Reloj deportivo de cuerpo negro y detalles de gran contraste.",
      229900,
      7,
      "Deportivo",
      "reloj-gear-negro.jpg",
    ],
    [
      "Noa Aqua",
      "Reloj de color aqua con una silueta ligera para el uso diario.",
      129900,
      3,
      "Urbano",
      "reloj-noa-aqua.jpg",
    ],
  ];
  for (const [
    nombre,
    descripcion,
    precio,
    stock,
    categoria,
    foto,
  ] of productos) {
    if (!(await Product.exists({ nombre, usuario: usuario._id }))) {
      await Product.create({
        nombre,
        descripcion,
        precio,
        stock,
        categoria,
        imagen: "/img/" + foto,
        usuario: usuario._id,
      });
    }
  }
  console.log(
    "Colección de demostración preparada. Acceso guardado en DEMO_EMAIL y DEMO_PASSWORD de .env.",
  );
};
cargar()
  .catch((error) => {
    console.error("No fue posible preparar la demostración. Tipo:", error.name);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
