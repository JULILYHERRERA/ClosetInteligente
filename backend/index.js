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

// Ruta de prueba para verificar conexión
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
//ruta para que funcione lo de registrar 
// Ruta para registrar un usuario

app.post("/register", async (req, res) => {
  try {
    const { nombre, apellido, fecha_nacimiento, email, contrasena } = req.body;

    // 1. Validación de campos obligatorios
    if (!nombre || !apellido || !fecha_nacimiento || !email || !contrasena) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // 2. Validación de fecha (YYYY-MM-DD)
    const regexFecha = /^\d{4}-\d{2}-\d{2}$/;
    if (!regexFecha.test(fecha_nacimiento)) {
      return res.status(400).json({ message: "La fecha debe tener el formato YYYY-MM-DD" });
    }

    const fechaValida = new Date(fecha_nacimiento);
    if (isNaN(fechaValida.getTime())) {
      return res.status(400).json({ message: "Fecha inválida" });
    }

    // 3. Validación de email
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email)) {
      return res.status(400).json({ message: "El email no es válido" });
    }

    // 4. Validación de contraseña (mínimo 8 caracteres, al menos 1 letra y 1 número)
    const regexPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!regexPassword.test(contrasena)) {
      return res.status(400).json({
        message: "La contraseña debe tener mínimo 8 caracteres, incluir al menos una letra y un número",
      });
    }

    // 🔒 5. Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // 6. Inserción segura con parámetros
    const result = await pool.query(
      "INSERT INTO usuarios (nombre, apellido, fecha_nacimiento, email, contrasena) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      [nombre, apellido, fecha_nacimiento, email, hashedPassword]
    );

    res.json({ message: "Usuario registrado con éxito ✅", userId: result.rows[0].id });

  } catch (error) {
    console.error("Error en /register:", error);
    res.status(500).json({ message: "Error interno del servidor ❌" });
  }
});










// Levantar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});



