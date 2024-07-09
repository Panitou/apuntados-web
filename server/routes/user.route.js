import express from "express";
import {
  test,
  updateUser,
  deleteUser,
  getUserListings,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

// Crea un nuevo enrutador utilizando Express Router
const router = express.Router();

// Define las rutas y sus respectivos controladores para las operaciones de usuario

// Ruta GET para pruebas
router.get("/test", test);

// Ruta POST para actualizar un usuario por su ID
router.post("/update/:id", verifyToken, updateUser);

// Ruta DELETE para eliminar un usuario por su ID
router.delete("/delete/:id", verifyToken, deleteUser);

// Ruta GET para obtener los listados de un usuario por su ID
router.get("/listings/:id", verifyToken, getUserListings);

// Exporta el enrutador para que pueda ser utilizado en otros archivos
export default router;
