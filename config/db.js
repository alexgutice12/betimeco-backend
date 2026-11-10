const mongoose = require("mongoose");
const dns = require("node:dns");

const dbConnection = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("Falta MONGO_URI en el archivo .env");
  }

  // Ajuste opcional para equipos cuyo DNS no resuelve los registros de Atlas.
  if (process.env.DNS_SERVERS) {
    dns.setServers(
      process.env.DNS_SERVERS.split(",").map((valor) => valor.trim()),
    );
  }

  await mongoose.connect(process.env.MONGO_URI);
  await mongoose.connection.db.command({ ping: 1 });
  console.log("Conectado a MongoDB Atlas:", mongoose.connection.name);
};

module.exports = dbConnection;
