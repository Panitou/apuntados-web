import jwt from "jsonwebtoken"; // Importa JWT para trabajar con tokens JWT
import { errorHandler } from "./error.js"; // Importa una función errorHandler para manejar errores

// Middleware para verificar el token de acceso
export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token; // Obtiene el token de acceso desde las cookies de la solicitud

  // Si no hay token, llama al errorHandler con código 401 (Unauthorized)
  if (!token) return next(errorHandler(401, "Unauthorized"));

  // Verifica el token usando JWT_SECRET almacenado en las variables de entorno
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    // Si hay un error al verificar el token, llama al errorHandler con código 403 (Forbidden)
    if (err) return next(errorHandler(403, "Forbidden"));

    // Si el token es válido, agrega el usuario decodificado a req.user y pasa al siguiente middleware
    req.user = user;
    next();
  });
};
