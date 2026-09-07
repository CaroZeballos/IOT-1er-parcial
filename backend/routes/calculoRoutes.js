const express = require("express");
const Calculo = require("../models/Calculo");
const {
     calcularSeno,
     calcularCoseno,
     calcularExponencial
    } = require("../utils/series");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { calculo_id, usuario_id, serie_id, x, n } = req.body;

    let valor_aproximado;
let valor_real;

if (serie_id === "SER001") {
  valor_aproximado = calcularSeno(x, n);
  valor_real = Math.sin(x);
} else if (serie_id === "SER002") {
  valor_aproximado = calcularCoseno(x, n);
  valor_real = Math.cos(x);
} else if (serie_id === "SER003") {
  valor_aproximado = calcularExponencial(x, n);
  valor_real = Math.exp(x);
} else {

  throw new Error("Serie no válida");
}

    // Calcular errores
    const error_absoluto = Math.abs(valor_real - valor_aproximado);

    const error_porcentual =
      valor_real !== 0
        ? (error_absoluto / Math.abs(valor_real)) * 100
        : 0;

    // Crear cálculo
    const calculo = new Calculo({
      calculo_id,
      usuario_id,
      serie_id,
      x,
      n,
      valor_aproximado,
      valor_real,
      error_absoluto,
      error_porcentual
    });

    await calculo.save();

    res.status(201).json({
      mensaje: "Cálculo realizado y guardado correctamente",
      calculo
    });

  } catch (error) {
    res.status(400).json({
      mensaje: "Error al realizar cálculo",
      error: error.message
    });
  }
});

// Obtener todos los cálculos
router.get("/", async (req, res) => {
  try {
    const calculos = await Calculo.find();

    res.json(calculos);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener los cálculos",
      error: error.message
    });
  }
});


// Obtener cálculos de un usuario
router.get("/usuario/:usuarioId", async (req, res) => {
  try {
    const calculos = await Calculo.find({
      usuario_id: req.params.usuarioId
    });

    res.json(calculos);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener los cálculos del usuario",
      error: error.message
    });
  }
});

module.exports = router;