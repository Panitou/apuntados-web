import bcryptjs from "bcryptjs"; // Importa bcryptjs para el hashing de contraseñas
import { errorHandler } from "../utils/error.js"; // Importa el manejador de errores personalizado
import User from "../models/user.model.js"; // Importa el modelo de usuario
import Listing from "../models/listing.mode.js"; // Importa el modelo de listado

// Controlador para una ruta de prueba
export const test = (req, res) => {
  res.json({
    message: "Hello world", // Responde con un mensaje JSON
  });
};

// Controlador para actualizar un usuario
export const updateUser = async (req, res, next) => {
  // Verifica si el ID del usuario del token no coincide con el ID proporcionado en los parámetros
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only update your own account!"));

  try {
    if (req.body.password) {
      // Si se proporciona una nueva contraseña, la hashea usando bcryptjs
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    // Actualiza el usuario encontrado por ID con los datos proporcionados
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true } // Devuelve el documento actualizado
    );

    // Extrae la contraseña del documento actualizado para no enviarla al cliente
    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest); // Responde con los datos actualizados del usuario
  } catch (error) {
    next(error); // Maneja cualquier error y pásalo al siguiente middleware de manejo de errores
  }
};

// Controlador para eliminar un usuario
export const deleteUser = async (req, res, next) => {
  // Verifica si el ID del usuario del token no coincide con el ID proporcionado en los parámetros
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only delete your own account!"));

  try {
    // Encuentra y elimina al usuario por ID
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token"); // Borra la cookie de acceso del usuario
    res.status(200).json("User has been deleted!"); // Responde con un mensaje de éxito
  } catch (error) {
    next(error); // Maneja cualquier error y pásalo al siguiente middleware de manejo de errores
  }
};

// Controlador para obtener los listados de un usuario
export const getUserListings = async (req, res, next) => {
  // Verifica si el ID del usuario del token coincide con el ID proporcionado en los parámetros
  if (req.user.id === req.params.id) {
    try {
      // Encuentra los listados donde userRef coincida con el ID del usuario
      const listings = await Listing.find({ userRef: req.params.id });
      res.status(200).json(listings); // Responde con los listados encontrados
    } catch (error) {
      next(error); // Maneja cualquier error y pásalo al siguiente middleware de manejo de errores
    }
  } else {
    return next(errorHandler(401, "You cannot view your listings")); // Maneja el error si el ID del usuario no coincide
  }
};
