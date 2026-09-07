console.log("serieRoutes cargado ✅");

const express = require("express");
const Serie = require("../models/Serie");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const series = await Serie.find();

    res.json(series);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener las series",
      error: error.message
    });
  }
});

module.exports = router;