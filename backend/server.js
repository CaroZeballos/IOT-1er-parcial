const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const usuarioRoutes = require("./routes/usuarioRoutes");
const serieRoutes = require("./routes/serieRoutes");
const calculoRoutes = require("./routes/calculoRoutes");

const app = express();
const PORT = 3030;

app.use(cors());
app.use(express.json());

// Conexión con MongoDB
mongoose.connect("mongodb://localhost:27017/series_matematicas")
  .then(() => {
    console.log("MongoDB conectada correctamente ✅");
  })
  .catch((error) => {
    console.error("Error al conectar con MongoDB ❌", error);
  });

// Rutas
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/series", serieRoutes);
app.use("/api/calculos", calculoRoutes);


// Ruta principal
app.get("/", (req, res) => {
  res.json({
    mensaje: "API de series matemáticas funcionando 🚀"
  });
});

app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});