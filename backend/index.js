const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
require("dotenv").config();
const bcrypt = require("bcrypt");
const multer = require("multer");

const app = express();
app.use(cors());
app.use(express.json());

// CONEXION A NEON USANDO DATABASE_URL DE .ENV
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// -------------------------------------------------
// RUTA DE VERIFICACION DE LA BD
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
//  RUTA PARA EL REGISTRO
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

    //  Verificar si el email ya existe
    const existe = await pool.query("SELECT 1 FROM usuarios WHERE email = $1", [email]);
    if (existe.rows.length > 0) {
      return res.status(400).json({ message: "El email ya está registrado ❌" });
    }

    // Hashear la contraseña
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


// RUTA DEL LOGIN
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


//  RUTA PARA PREFERENCIAS 
app.post("/preferencias", async (req, res) => {
  console.log("Body recibido:", req.body); 
  const client = await pool.connect();
  try {
    const { userId, colores, estilos, ocasiones, prendas } = req.body;
    const usuario_id = userId; // asignar para mantener el resto del código igual
    if (!usuario_id) {
      return res.status(400).json({ message: "Falta el ID de usuario" });
    }

    const usuarioExiste = await client.query("SELECT 1 FROM usuarios WHERE id = $1", [usuario_id]);
    if (usuarioExiste.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    await client.query("BEGIN");

    // Guardar colores
    if (colores?.length) {
      for (const id of colores) {
        await client.query(
          "INSERT INTO usuario_colores (id_usuario, id_color) VALUES ($1, $2) ON CONFLICT DO NOTHING",
          [usuario_id, id]
        );
      }
    }

    // Guardar estilos
    if (estilos?.length) {
      for (const id of estilos) {
        await client.query(
          "INSERT INTO usuario_estilos (id_usuario, id_estilo) VALUES ($1, $2) ON CONFLICT DO NOTHING",
          [usuario_id, id]
        );
      }
    }

    // Guardar ocasiones
    if (ocasiones?.length) {
      for (const id of ocasiones) {
        await client.query(
          "INSERT INTO usuario_ocasiones (id_usuario, id_ocasiones) VALUES ($1, $2) ON CONFLICT DO NOTHING",
          [usuario_id, id]
        );
      }
    }

    // Guardar prendas
    if (prendas?.length) {
      for (const id of prendas) {
        await client.query(
          "INSERT INTO usuario_prendas (id_usuario, id_prenda) VALUES ($1, $2) ON CONFLICT DO NOTHING",
          [usuario_id, id]
        );
      }
    }

    await client.query("COMMIT");
    return res.json({ message: "Preferencias guardadas con éxito ✅" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error en /preferencias:", error.stack);
    return res.status(500).json({ message: "Error interno del servidor ❌", detalle: error.message });
  } finally {
    client.release();
  }
});


// Configuración multer (sube imagen a memoria como buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// -------------------------------------------------

//RUTA PARA AGREGAR PRENDA (recibe multipart con campo "imagen")
app.post("/prendas", upload.single("imagen"), async (req, res) => {
  try {
    const { usuarioId, id_prenda } = req.body;

    console.log(" /prendas ->", {
      usuarioId, id_prenda,
      hasFile: !!req.file,
      mimetype: req.file?.mimetype,
      name: req.file?.originalname,
      size: req.file?.buffer?.length
    });

    if (!usuarioId || !id_prenda) {
      return res.status(400).json({ message: "Faltan usuarioId o id_prenda" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "Debes subir una imagen (campo 'imagen')" });
    }

    // Inserta SOLO columnas existentes: id_usuario, id_prenda, imagen, mime
    await pool.query(
      "INSERT INTO imagenes (id_usuario, id_prenda, imagen, mime) VALUES ($1, $2, $3, $4)",
      [usuarioId, id_prenda, req.file.buffer, req.file.mimetype || "image/png"]
    );

    return res.json({ message: "Prenda guardada correctamente" });
  } catch (error) {
    console.error("❌ Error en POST /prendas:", error.stack || error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
});


// -------------------------------------------------
// LISTAR PRENDAS DE UN USUARIO
app.get("/prendas", async (req, res) => {
  try {
    const { usuarioId } = req.query;
    if (!usuarioId) {
      return res.status(400).json({ message: "Falta usuarioId" });
    }

    const base = req.protocol + "://" + req.get("host");
    const r = await pool.query(
      "SELECT id, id_prenda FROM imagenes WHERE id_usuario = $1 ORDER BY id DESC",
      [usuarioId]
    );

    const data = r.rows.map(row => ({
      id: row.id,
      id_prenda: row.id_prenda,
      imagenUrl: `${base}/prendas/${row.id}/imagen`, // servimos el binario
    }));

    res.json(data);
  } catch (error) {
    console.error("❌ GET /prendas:", error.stack || error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});


// -------------------------------------------------
// SERVIR LA IMAGEN (BINARIO) POR ID
app.get("/prendas/:id/imagen", async (req, res) => {
  try {
    const { id } = req.params;
    const r = await pool.query(
      "SELECT imagen, mime FROM imagenes WHERE id = $1",
      [id]
    );

    if (r.rows.length === 0) {
      return res.status(404).send("Imagen no encontrada");
    }

    const mime = r.rows[0].mime || "application/octet-stream";
    res.set("Content-Type", mime);
    res.send(r.rows[0].imagen);
  } catch (error) {
    console.error("Error en GET /prendas/:id/imagen:", error.stack || error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});


// -------------------------------------------------
// LEVANTAR EL SERVIDOR 
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});




