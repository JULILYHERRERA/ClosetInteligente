// index.js
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
require("dotenv").config();
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a Neon usando DATABASE_URL de .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// -------------------------------------------------
// 📌 Ruta de prueba para verificar conexión
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ message: "Conexión exitosa 🚀", serverTime: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error conectando a la base de datos" });
  }
});

// -------------------------------------------------
// 📌 Ruta para registrar un usuario
app.post("/register", async (req, res) => {
  try {
    const { nombre, apellido, fecha_nacimiento, email, contrasena } = req.body;

    if (!nombre || !apellido || !fecha_nacimiento || !email || !contrasena) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const regexFecha = /^\d{4}-\d{2}-\d{2}$/;
    if (!regexFecha.test(fecha_nacimiento)) {
      return res.status(400).json({ message: "La fecha debe tener el formato YYYY-MM-DD" });
    }

    const fechaValida = new Date(fecha_nacimiento);
    if (isNaN(fechaValida.getTime())) {
      return res.status(400).json({ message: "Fecha inválida" });
    }

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email)) {
      return res.status(400).json({ message: "El email no es válido" });
    }

    const regexPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!regexPassword.test(contrasena)) {
      return res.status(400).json({
        message: "La contraseña debe tener mínimo 8 caracteres, incluir al menos una letra y un número",
      });
    }

    // 🔎 Verificar si el email ya existe
    const existe = await pool.query("SELECT 1 FROM usuarios WHERE email = $1", [email]);
    if (existe.rows.length > 0) {
      return res.status(400).json({ message: "El email ya está registrado ❌" });
    }

    // 🔒 Hashear la contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const result = await pool.query(
      "INSERT INTO usuarios (nombre, apellido, fecha_nacimiento, email, contrasena) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      [nombre, apellido, fecha_nacimiento, email, hashedPassword]
    );

    return res.status(201).json({
      message: "Usuario registrado con éxito ✅",
      userId: result.rows[0].id,
    });

  } catch (error) {
    console.error("Error en /register:", error.stack);
    return res.status(500).json({ message: "Error interno del servidor ❌" });
  }
});

// -------------------------------------------------
// 📌 Ruta para login
app.post("/login", async (req, res) => {
  try {
    const { email, contrasena } = req.body;

    if (!email || !contrasena) {
      return res.status(400).json({ message: "Email y contraseña son obligatorios" });
    }

    // 1. Buscar usuario por email
    const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "El email no está registrado" });
    }

    const usuario = result.rows[0];

    // 2. Comparar la contraseña ingresada con la hash en BD
    const esValida = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!esValida) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    // 3. Eliminar contraseña del objeto antes de devolver
    delete usuario.contrasena;

    return res.json({ message: "Inicio de sesión exitoso ✅", usuario });

  } catch (error) {
    console.error("Error en /login:", error.stack);
    return res.status(500).json({ message: "Error interno del servidor ❌" });
  }
});

// -------------------------------------------------
// 🚀 Levantar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
