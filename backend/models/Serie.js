const mongoose = require("mongoose");

const serieSchema = new mongoose.Schema({
  serie_id: {
    type: String,
    required: true,
    unique: true
  },
  nombre: {
    type: String,
    required: true
  },
  tipo: {
    type: String,
    required: true
  },
  funcion: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Serie", serieSchema);