const express = require("express");
const Calculo = require("../models/Calculo");
const {
     calcularSeno,
     calcularCoseno,
     calcularExponencial,
     calcularProgresion
    } = require("../utils/series");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { calculo_id, usuario_id, x, n } = req.body;
    const serie_id = String(req.body.serie_id || "").trim().toUpperCase();
    const numeroTerminos = Number(n);
    const valorX = Number(x);

    if (!Number.isFinite(valorX) || !Number.isInteger(numeroTerminos) || numeroTerminos < 1 || numeroTerminos > 999) {
      throw new Error("x debe ser un número y n debe estar entre 1 y 999");
    }

    let valor_aproximado;
let valor_real;

if (serie_id === "SER001") {
  valor_aproximado = calcularSeno(valorX, numeroTerminos);
  valor_real = Math.sin(valorX);
} else if (serie_id === "SER002") {
  valor_aproximado = calcularCoseno(valorX, numeroTerminos);
  valor_real = Math.cos(valorX);
} else if (serie_id === "SER003") {
  valor_aproximado = calcularExponencial(valorX, numeroTerminos);
  valor_real = Math.exp(valorX);
} else {

  throw new Error("Serie no válida");
}

    // Calcular errores
    const error_absoluto = Math.abs(valor_real - valor_aproximado);

    const error_porcentual =
      valor_real !== 0
        ? (error_absoluto / Math.abs(valor_real)) * 100
        : 0;

    const calculo = await Calculo.create({
      calculo_id,
      usuario_id,
      serie_id,
      x: valorX,
      n: numeroTerminos,
      valor_aproximado,
      valor_real,
      error_absoluto,
      error_porcentual
    });

    res.status(201).json({
      mensaje: "Cálculo realizado y guardado correctamente",
      calculo,
      aproximaciones: calcularProgresion(
        serie_id,
        valorX,
        numeroTerminos
      )
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
    }).sort({ fecha: 1 });

    res.json(calculos);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener los cálculos del usuario",
      error: error.message
    });
  }
});

// Obtener la evolución del error para un cálculo concreto
router.get("/:calculoId/progresion", async (req, res) => {
  try {
    const calculo = await Calculo.findOne({
      calculo_id: req.params.calculoId
    });

    if (!calculo) {
      return res.status(404).json({ mensaje: "Cálculo no encontrado" });
    }

    const aproximaciones = calcularProgresion(
      calculo.serie_id,
      calculo.x,
      calculo.n
    ).map((punto) => {
      const errorAbsoluto = Math.abs(calculo.valor_real - punto.valor);
      const errorPorcentual = calculo.valor_real !== 0
        ? (errorAbsoluto / Math.abs(calculo.valor_real)) * 100
        : 0;

      return {
        termino: punto.termino,
        valor: punto.valor,
        error_porcentual: errorPorcentual
      };
    });

    res.json({ calculo, aproximaciones });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener la progresión",
      error: error.message
    });
  }
});

module.exports = router;
