const express = require("express");
const bcrypt = require("bcrypt");
const Usuario = require("../models/Usuario");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { usuario_id, nombre, email, password } = req.body;

    if (!usuario_id || !nombre || !email || !password) {
      return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }

    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(409).json({ mensaje: "El correo ya está registrado" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const usuario = await Usuario.create({
      usuario_id,
      nombre,
      email,
      password: passwordHash
    });

    res.status(201).json({
      mensaje: "Usuario registrado correctamente",
      usuario: {
        usuario_id: usuario.usuario_id,
        nombre: usuario.nombre,
        email: usuario.email
      }
    });
  } catch (error) {
    res.status(400).json({
      mensaje: "Error al registrar el usuario",
      error: error.message
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ email });

    if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
      return res.status(401).json({ mensaje: "Correo o contraseña incorrectos" });
    }

    res.json({
      mensaje: "Inicio de sesión exitoso",
      usuario: {
        usuario_id: usuario.usuario_id,
        nombre: usuario.nombre,
        email: usuario.email
      }
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al iniciar sesión",
      error: error.message
    });
  }
});

module.exports = router;
