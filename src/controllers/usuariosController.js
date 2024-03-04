import { pool } from "../db.js";

export const Usuarios = async (req, res) => {
  const [roles] = await pool.query("SELECT * FROM rol_usuario");
  res.render("usuarios", { roles: roles });
};


export const listUsuarios = async (req, res) => {
  const [rows] = await pool.query("SELECT usuarios.*, rol_usuario.rol_nombre FROM usuarios JOIN rol_usuario ON usuarios.rol = rol_usuario.id_rol");
  res.render("tabla_usuarios", { usuarios: rows });
};

export const createUsuario = async (req, res) => {
  const newUsuario = req.body;
  await pool.query("INSERT INTO usuarios set ?", [newUsuario]);
  res.redirect("/");
};

export const editUsuario = async (req, res) => {
  const { id } = req.params;
  const [result] = await pool.query("SELECT * FROM usuarios WHERE id = ?", [
    id,
  ]);
  res.render("usuarios_edit", { usuario: result[0] });
};

export const updateUsuario = async (req, res) => {
  const { id } = req.params;
  const newUsuario = req.body;
  await pool.query("UPDATE usuarios set ? WHERE id = ?", [newUsuario, id]);
  res.redirect("/");
};

export const deleteUsuario = async (req, res) => {
  const { id } = req.params;
  const result = await pool.query("DELETE FROM usuarios WHERE id = ?", [id]);
  if (result.affectedRows === 1) {
    res.json({ message: "Usuario deleted" });
  }
  res.redirect("/");
};
