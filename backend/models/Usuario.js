const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
  usuario_id: {
    type: String,
    required: true,
    unique: true
  },
  nombre: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Usuario", usuarioSchema);