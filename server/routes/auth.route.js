import express from "express";
import {
  google,
  signin,
  signup,
  signOut,
} from "../controllers/auth.controller.js";

// Crea un nuevo enrutador usando Express Router
const router = express.Router();

// Define las rutas y sus respectivos controladores para la autenticación

// Ruta POST para registrarse
router.post("/signup", signup);

// Ruta POST para iniciar sesión
router.post("/signin", signin);

// Ruta POST para autenticación con Google
router.post("/google", google);

// Ruta GET para cerrar sesión
router.get("/signout", signOut);

// Exporta el enrutador para que pueda ser utilizado en otros archivos
export default router;
