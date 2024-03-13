import { Router } from "express";
import {
  Index,
  Contrato,
  createContrato,
  listContrato,
//  deleteContrato,
//  editContrato,
//  updateContrato,
} from "../controllers/contratosController.js";
const router = Router();

router.get("/", Index);
router.get("/table_contratos", listContrato);
router.get("/contrato", Contrato);
router.post("/add_contrato", createContrato);
//router.get("/update/:id", editContrato);
//router.post("/update/:id", updateContrato);
//router.get("/delete/:id", deleteContrato);

export default router;