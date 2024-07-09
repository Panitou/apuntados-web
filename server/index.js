// Importación de módulos y dependencias
import express from "express"; // Importa Express como framework para Node.js
import mongoose from "mongoose"; // Importa Mongoose para la conexión a MongoDB
import dotenv from "dotenv"; // Importa dotenv para gestionar variables de entorno
import userRouter from "./routes/user.route.js"; // Importa el enrutador de usuario
import authRouter from "./routes/auth.route.js"; // Importa el enrutador de autenticación
import listingRouter from "./routes/listing.route.js"; // Importa el enrutador de listados
import cookieParser from "cookie-parser"; // Importa cookie-parser para gestionar cookies
import path from "path"; // Importa path para gestionar rutas de archivos

// Cargar variables de entorno desde el archivo .env
dotenv.config();

// Obtener la cadena de conexión desde las variables de entorno
const mongoURI = process.env.MONGO_URI;

// Conexión a MongoDB usando Mongoose
mongoose
  .connect(mongoURI) // Conecta a MongoDB usando la cadena de conexión obtenida
  .then(() => {
    console.log("Conexión exitosa a MongoDB"); // Mensaje de éxito cuando la conexión es establecida
  })
  .catch((err) => {
    console.error("Error al conectar a MongoDB:", err); // Manejo de errores si la conexión falla
  });

// Resolución del directorio base (__dirname) para rutas estáticas
const __dirname = path.resolve();

// Creación de la aplicación Express
const app = express();

// Middleware para parsear JSON en las solicitudes
app.use(express.json());

// Middleware para parsear cookies en las solicitudes
app.use(cookieParser());

// Inicia el servidor Express en el puerto 3000
app.listen(3000, () => {
  console.log("Servidor iniciado en el puerto 3000");
});

// Middleware para enrutar las solicitudes a /api/user hacia userRouter
app.use("/api/user", userRouter);

// Middleware para enrutar las solicitudes a /api/auth hacia authRouter
app.use("/api/auth", authRouter);

// Middleware para enrutar las solicitudes a /api/listing hacia listingRouter
app.use("/api/listing", listingRouter);

// Middleware para servir archivos estáticos desde el directorio /client/dist
app.use(express.static(path.join(__dirname, "/client/dist")));

// Middleware para manejar todas las demás rutas, sirve el archivo index.html
// desde el directorio /client/dist para las rutas no manejadas explícitamente
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

// Middleware para manejar errores, responde con un JSON con el código de estado y el mensaje de error
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500; // Código de estado predeterminado: 500 (Error interno del servidor)
  const message = err.message || "Error interno del servidor"; // Mensaje de error predeterminado
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
