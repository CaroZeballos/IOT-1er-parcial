const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const usuarioRoutes = require("./routes/usuarioRoutes");
const serieRoutes = require("./routes/serieRoutes");
const calculoRoutes = require("./routes/calculoRoutes");
const Serie = require("./models/Serie");

const app = express();
const PORT = 3030;

app.use(cors());
app.use(express.json());

// Conexión con MongoDB
async function iniciarServidor() {
  try {
    await mongoose.connect("mongodb://localhost:27017/series_matematicas");
    console.log("MongoDB conectada correctamente ✅");

    const seriesIniciales = [
      {
        serie_id: "SER001",
        nombre: "Serie de Taylor del seno",
        tipo: "Trigonométrica",
        funcion: "sen(x)"
      },
      {
        serie_id: "SER002",
        nombre: "Serie de Taylor del coseno",
        tipo: "Trigonométrica",
        funcion: "cos(x)"
      },
      {
        serie_id: "SER003",
        nombre: "Serie de Taylor exponencial",
        tipo: "Exponencial",
        funcion: "eˣ"
      }
    ];

    await Promise.all(
      seriesIniciales.map(({ serie_id, ...datos }) =>
        Serie.updateOne(
          { serie_id },
          { $setOnInsert: { serie_id, ...datos } },
          { upsert: true }
        )
      )
    );

    console.log("Series matemáticas disponibles ✅");

    app.listen(PORT, () => {
      console.log(`Servidor funcionando en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error al conectar con MongoDB ❌", error);
    process.exitCode = 1;
  }
}

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

iniciarServidor();
