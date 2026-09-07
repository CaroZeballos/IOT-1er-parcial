const mongoose = require("mongoose");

const calculoSchema = new mongoose.Schema({
  calculo_id: {
    type: String,
    required: true,
    unique: true
  },
  usuario_id: {
    type: String,
    required: true
  },
  serie_id: {
    type: String,
    required: true
  },
  x: {
    type: Number,
    required: true
  },
  n: {
    type: Number,
    required: true
  },
  valor_aproximado: {
    type: Number,
    required: true
  },
  valor_real: {
    type: Number,
    required: true
  },
  error_absoluto: {
    type: Number,
    required: true
  },
  error_porcentual: {
    type: Number,
    required: true
  },
  fecha: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Calculo", calculoSchema);