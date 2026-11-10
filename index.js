require("dotenv").config({ quiet: true });
const mongoose = require("mongoose");
const dbConnection = require("./config/db");
const app = require("./app");
const PORT = Number(process.env.PORT || 3000);
const iniciarServidor = async () => {
  if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535)
    throw new Error("PORT no es válido");
  if (!process.env.SECRET_KEY || process.env.SECRET_KEY.length < 32)
    throw new Error("Falta SECRET_KEY");
  await dbConnection();
  await require("./models/User").init();
  const servidor = app.listen(PORT, "127.0.0.1", () => {
    console.log(
      "BeTimeCo disponible en http://localhost:" + PORT + "/api/estado",
    );
  });
  servidor.on("error", async (error) => {
    console.error(
      error.code === "EADDRINUSE"
        ? "El puerto está ocupado"
        : "No fue posible iniciar el servidor",
    );
    await mongoose.disconnect();
    process.exitCode = 1;
  });
};
iniciarServidor().catch(async (error) => {
  console.error(
    "No fue posible iniciar BeTimeCo. Revisa la configuración y Atlas. Tipo:",
    error.name,
  );
  await mongoose.disconnect();
  process.exitCode = 1;
});
