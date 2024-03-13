import express from "express";
import path from "path";
import morgan from "morgan";

import UsuariosRoutes from "./routes/usuario.routes.js";
import ContratosRoutes from "./routes/contrato.routes.js";
import { fileURLToPath } from "url";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// settings
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// middlewares
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));

// routes
app.use(UsuariosRoutes);
app.use(ContratosRoutes);

// static files
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "datos")));

const datosRoutes = ['/datos/selectCiudad.js', '/datos/selectDepartamento.js'];

app.get(datosRoutes, (req, res) => {
  const requestedPath = req.url;

  // Verificar si la ruta solicitada está en el arreglo de rutas permitidas
  if (datosRoutes.includes(requestedPath)) {
    // Construir la ruta completa al archivo y enviarlo
    res.sendFile(path.join(__dirname, requestedPath));
  } else {
    
    res.status(404).send('Not Found');
  }
});

// starting the server
export default app;
