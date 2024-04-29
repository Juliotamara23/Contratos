import { pool } from "../db.js";
import multer from 'multer';

export const Index = async (req, res) => {
  res.render("index");
};

// Definimos la función middleware de multer para subir archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {

    cb(null, 'archivos_contratos'); // Directorio de destino para los archivos
  },
  filename: (req, file, cb) => {

    const date = new Date().toISOString().replace(/:/g, '-'); // Formato de fecha para evitar conflictos en los nombres
    const filename = `${date}-${file.originalname}`; // Nombre del archivo concatenando la fecha y el nombre original
    cb(null, filename);
  }
});

// Función middleware de multer para subir archivos
export const upload = multer({ storage: storage }).array('archivo_contrato', 5);

export const uploadArchivos = async (req, res) => {
  const [contrato] = await pool.query("SELECT * FROM contrato");
  res.render("archivos", { contrato: contrato });
};

export const listContrato = async (req, res) => {
  const [rows] = await pool.query("SELECT contrato.*, usuarios.nombre, usuarios.apellido, contrato_tipo.nombre_tipo, estado.nombre_estado FROM contrato LEFT JOIN usuarios ON contrato.responsable = usuarios.id JOIN contrato_tipo ON contrato.tipo = contrato_tipo.id_tipo JOIN estado ON contrato.estado = estado.id_estado;");
  res.render("tabla_contratos", { contratos: rows });
};

export const Contrato = async (req, res) => {
  try {

    const [tipo] = await pool.query("SELECT * FROM contrato_tipo");
    const [responsable] = await pool.query("SELECT nombre, apellido FROM usuarios WHERE rol = 2");
    const [estado] = await pool.query("SELECT * FROM estado");

    res.render("contratos", { tipo: tipo, responsable: responsable, estado: estado });

  } catch (error) {
    console.error('Error al obtener datos para la creación del contrato:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Controlador para la carga de archivos
export const archivosContratos = async (req, res) => {
  const idContrato = req.body;

  try {
    let idcontrato = null;

    if (idContrato.contrato) {
      const [contrato] = await pool.query("SELECT id_contrato FROM contrato WHERE nombre_contrato = ?", [idContrato.contrato]);

      if (contrato.length === 0) {
        console.error(`El id ${contrato} del contrato especificado no existe`);
        res.status(400).send('El id del contrato especificado no existe');
        return;
      }

      idcontrato = contrato[0].id_contrato;
    }

    // Iterar sobre cada archivo cargado si existen
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const { originalname, filename, mimetype, size } = file;

        // Insertar la información del archivo en la base de datos
        await pool.query("INSERT INTO archivos (nombre_original, nombre_archivo, tipo_archivo, tamaño, contrato_id) VALUES (?, ?, ?, ?, ?)", [originalname, filename, mimetype, size, idcontrato]);
      }
    }

    res.redirect("/archivos_contratos");
  } catch (error) {
    console.error('Error al cargar y almacenar los archivos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const createContrato = async (req, res) => {
  const newContrato = req.body;

  try {

    // Generar un valor único basado en la fecha actual (Timestamp como ID)
    const currentDate = new Date();
    const idContrato = currentDate.getTime().toString();

    // Realiza una única consulta para obtener los IDs de tipo, estado y responsable

    const [tipo] = await pool.query("SELECT id_tipo FROM contrato_tipo WHERE nombre_tipo = ?", [newContrato.tipo]);
    const [estado] = await pool.query("SELECT id_estado FROM estado WHERE nombre_estado = ?", [newContrato.estado]);
    const [responsable] = await pool.query("SELECT id FROM usuarios WHERE nombre = ? AND apellido = ? AND rol = 2", [newContrato.responsable.split(" ")[0], newContrato.responsable.split(" ")[1]]);

    // Verifica si alguno de los tipos, estados o responsables no existe
    if (tipo.length === 0 || estado.length === 0 || responsable.length === 0) {
      console.error('El tipo, estado o responsable especificado no existe en la base de datos');
      res.status(400).send('El tipo, estado o responsable especificado no existe en la base de datos');
      return;
    }

    // Asigna los IDs de tipo, estado, responsable y el id_contrato al nuevo contrato
    newContrato.tipo = tipo[0].id_tipo;
    newContrato.estado = estado[0].id_estado;
    newContrato.responsable = responsable[0].id;
    newContrato.id_contrato = idContrato;

    // Realiza la inserción en la tabla contrato
    await pool.query("INSERT INTO contrato SET ?", [newContrato]);

    res.redirect("/table_contratos");
  } catch (error) {
    console.error('Error al crear el contrato:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const editContrato = async (req, res) => {
  const { id_contrato } = req.params;

  try {
    const [contrato] = await pool.query("SELECT contrato.*, usuarios.nombre, usuarios.apellido, contrato_tipo.nombre_tipo, estado.nombre_estado FROM contrato LEFT JOIN usuarios ON contrato.responsable = usuarios.id JOIN contrato_tipo ON contrato.tipo = contrato_tipo.id_tipo JOIN estado ON contrato.estado = estado.id_estado WHERE id_contrato = ?", [id_contrato])

    if (!contrato || contrato.length === 0) {
      console.error('No se encontró ningún contrato con el ID especificado:', id_contrato);
      res.status(404).send('No se encontró ningún contrato con el ID especificado');
      return;
    }

    const [tipo] = await pool.query("SELECT nombre_tipo FROM contrato_tipo");
    const [estado] = await pool.query("SELECT nombre_estado FROM estado");
    const [responsable] = await pool.query("SELECT nombre, apellido FROM usuarios WHERE rol = 2");

    console.log("Resultado de la consulta de contrato:", id_contrato);

    res.render("contratos_edit", { contrato: contrato[0], tipo, estado, responsable });
  } catch (error) {
    console.error('Error al ejecutar la consulta:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

export const updateContrato = async (req, res) => {
  const { id_contrato } = req.params;
  const newContrato = req.body;

  // Realiza una única consulta para obtener los IDs de tipo, estado y responsable
  const [tipo] = await pool.query("SELECT id_tipo FROM contrato_tipo WHERE nombre_tipo = ?", [newContrato.tipo]);
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
  await pool.query("UPDATE contrato SET ? WHERE id_contrato = ?", [newContrato, id_contrato]);

  res.redirect("/table_contratos");
};

export const deleteContrato = async (req, res) => {
  const { id_contrato } = req.params;
  const result = await pool.query("DELETE FROM contrato WHERE id_contrato = ?", [id_contrato]);
  if (result.affectedRows === 1) {
    res.json({ message: "Contrato eliminado" });
  }
  res.redirect("/table_contratos");
};

export const subirArchivos = async (req, res) => {
  const { id_contrato } = req.params;

  try {

    const [contrato] = await pool.query("SELECT * FROM contrato WHERE id_contrato = ?", [id_contrato]);

    res.render("archivos_contrato", { contrato: contrato[0] });
  } catch (error) {
    console.error('Error al ejecutar la consulta:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Controlador para cargar archivos a un contrato
export const contratoArchivos = async (req, res) => {
  const { id_contrato } = req.params;

  try {
    if (!id_contrato) {
      console.error('No se ha proporcionado un ID de contrato');
      res.status(400).send('No se ha proporcionado un ID de contrato');
      return;
    }

    const [contrato] = await pool.query("SELECT id_contrato FROM contrato WHERE id_contrato = ?", [id_contrato]);

    if (contrato.length === 0) {
      console.error(`El contrato especificado con el ID ${id_contrato} no existe`);
      res.status(404).send('El contrato especificado no existe');
      return;
    }

    // Obtener el ID del contrato directamente desde el resultado de la consulta SQL
    const contratoId = contrato[0].id_contrato;

    // Iterar sobre cada archivo cargado si existen
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const { originalname, filename, mimetype, size } = file;

        // Insertar la información del archivo en la base de datos
        await pool.query("INSERT INTO archivos (nombre_original, nombre_archivo, tipo_archivo, tamaño, contrato_id) VALUES (?, ?, ?, ?, ?)", [originalname, filename, mimetype, size, contratoId]);
      }
    }

    res.redirect("/table_contratos");
  } catch (error) {
    console.error('Error al cargar y almacenar los archivos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const listArchivos = async (req, res) => {
  const [rows] = await pool.query("SELECT archivos.*, contrato.nombre_contrato FROM archivos LEFT JOIN contrato ON archivos.contrato_id = contrato.id_contrato;");
  res.render("tabla_archivos", { archivos: rows });
};

export const deleteArchivo = async (req, res) => {
  const { id_archivo } = req.params;
  const result = await pool.query("DELETE FROM archivos WHERE id_archivo = ?", [id_archivo]);
  if (result.affectedRows === 1) {
    res.json({ message: "Archivo eliminado" });
  }
  res.redirect("/table_archivos");
};