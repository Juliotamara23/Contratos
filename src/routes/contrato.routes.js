import { Router } from "express";
import {
  Index,
  Contrato,
  createContrato,
  listContrato,
  deleteContrato,
  editContrato,
  updateContrato,
} from "../controllers/contratosController.js";
const router = Router();

router.get("/", Index);
router.get("/table_contratos", listContrato);
router.get("/contrato", Contrato);
router.post("/add_contrato", createContrato);
router.get("/update_contrato/:id_contrato", editContrato);
router.post("/update_contrato/:id_contrato", updateContrato);
router.get("/delete_contrato/:id_contrato", deleteContrato);

export default router;