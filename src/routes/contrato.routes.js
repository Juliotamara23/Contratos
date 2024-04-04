import { Router } from "express";
import {
  Index,
  uploadArchivos,
  archivosContratos,
  Contrato,
  createContrato,
  listContrato,
  deleteContrato,
  editContrato,
  updateContrato,
  upload,
  subirArchivos,
  contratoArchivos,
} from "../controllers/contratosController.js";
const router = Router();

router.get("/", Index);
router.get("/archivos_contratos",upload, uploadArchivos);
router.post("/add_archivos",upload, archivosContratos);
router.get("/table_contratos", listContrato);
router.get("/contrato",upload, Contrato);
router.post("/add_contrato",upload, createContrato);
router.get("/update_contrato/:id_contrato", editContrato);
router.post("/update_contrato/:id_contrato", updateContrato);
router.get("/delete_contrato/:id_contrato", deleteContrato);
router.get("/contrato_archivos/:id_contrato", subirArchivos);
router.post("/add_archivos_contrato/:id_contrato",upload, contratoArchivos);

export default router;