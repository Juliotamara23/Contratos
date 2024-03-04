import { Router } from "express";
import {
  createUsuario,
  listUsuarios,
  Usuarios,
  deleteUsuario,
  editUsuario,
  updateUsuario,
} from "../controllers/usuariosController.js";
const router = Router();

router.get("/", listUsuarios);
router.get("/user", Usuarios);
router.post("/add", createUsuario);
router.get("/update/:id", editUsuario);
router.post("/update/:id", updateUsuario);
router.get("/delete/:id", deleteUsuario);

export default router;
