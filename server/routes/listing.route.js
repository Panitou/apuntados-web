import express from "express";
import {
  createListing,
  deleteListing,
  updateListing,
  getListing,
  getListings,
} from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

// Crea un nuevo enrutador utilizando Express Router
const router = express.Router();

// Define las rutas y sus respectivos controladores para los listados (listings)

// Ruta POST para crear un nuevo listado
router.post("/create", verifyToken, createListing);

// Ruta DELETE para eliminar un listado por su ID
router.delete("/delete/:id", verifyToken, deleteListing);

// Ruta POST para actualizar un listado por su ID
router.post("/update/:id", verifyToken, updateListing);

// Ruta GET para obtener un listado por su ID
router.get("/get/:id", getListing);

// Ruta GET para obtener todos los listados
router.get("/get", getListings);

// Exporta el enrutador para que pueda ser utilizado en otros archivos
export default router;
