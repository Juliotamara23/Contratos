import { pool } from "../db.js";

export const Index = async (req, res) => {
  res.render("index");
};

export const listContrato = async (req, res) => {
  const [rows] = await pool.query("SELECT contrato.*, usuarios.nombre, usuarios.apellido, contrato_tipo.nombre_tipo, estado.nombre_estado FROM contrato JOIN usuarios ON contrato.responsable = usuarios.id JOIN contrato_tipo ON contrato.tipo = contrato_tipo.id_tipo JOIN estado ON contrato.estado = estado.id_estado;");
  res.render("tabla_contratos", { contratos: rows });
};

export const Contrato = async (req, res) => {
  const [tipo] = await pool.query("SELECT * FROM contrato_tipo");
  const [responsable] = await pool.query("SELECT nombre, apellido FROM usuarios WHERE rol = 2;");
  const [estado] = await pool.query("SELECT * FROM estado");
  res.render("contratos", { tipo: tipo, responsable: responsable, estado: estado });
};

export const createContrato = async (req, res) => {
  const newContrato = req.body;

  try {
    // Realiza una única consulta para obtener los IDs de tipo, estado y responsable

    const [tipo] = await pool.query("SELECT id_tipo FROM contrato_tipo WHERE id_tipo = ?", [newContrato.tipo]);
    const [estado] = await pool.query("SELECT id_estado FROM estado WHERE nombre_estado = ?", [newContrato.estado]);
    const [responsable] = await pool.query("SELECT id FROM usuarios WHERE nombre = ? AND apellido = ? AND rol = 2", [newContrato.responsable.split(" ")[0], newContrato.responsable.split(" ")[1]]);

    // Registro de los resultados de las consultas SQL
    console.log("Resultado de la consulta de tipo:", tipo);
    console.log("Resultado de la consulta de estado:", estado);
    console.log("Resultado de la consulta de responsable:", responsable);

    // Verifica si alguno de los tipos, estados o responsables no existe
    if (tipo.length === 0) {
      console.error('El tipo especificado no existe en la tabla de tipos de contrato');
      res.status(400).send('El tipo especificado no existe en la tabla de tipos de contrato');
      return;
    }
    if (estado.length === 0) {
      console.error('El estado especificado no existe en la tabla de estados');
      res.status(400).send('El estado especificado no existe en la tabla de estados');
      return;
    }
    if (responsable.length === 0) {
      console.error('El responsable especificado no existe en la tabla de usuarios');
      res.status(400).send('El responsable especificado no existe en la tabla de usuarios');
      return;
    }

    // Asigna los IDs de tipo, estado y responsable al nuevo contrato
    newContrato.tipo = tipo[0].id_tipo;
    newContrato.estado = estado[0].id_estado;
    newContrato.responsable = responsable[0].id;

    // Realiza la inserción en la tabla contrato
    await pool.query("INSERT INTO contrato SET ?", [newContrato]);

    res.redirect("/table_contratos");
  } catch (error) {
    console.error('Error al crear el contrato:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};



