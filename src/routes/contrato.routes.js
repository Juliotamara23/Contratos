import { Router } from "express";
import {
  Index,
  Archivos,
  archivosContratos,
  Contrato,
  createContrato,
  listContrato,
  deleteContrato,
  editContrato,
  updateContrato,
  upload,
} from "../controllers/contratosController.js";
const router = Router();

router.get("/", Index);
router.get("/archivos_contratos",upload, Archivos);
router.post("/add_archivos",upload, archivosContratos);
router.get("/table_contratos", listContrato);
router.get("/contrato", Contrato);
router.post("/add_contrato", createContrato, upload);
router.get("/update_contrato/:id_contrato", editContrato);
router.post("/update_contrato/:id_contrato", updateContrato);
router.get("/delete_contrato/:id_contrato", deleteContrato);

export default router;