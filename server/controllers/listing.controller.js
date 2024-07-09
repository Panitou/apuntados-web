import Listing from "../models/listing.mode.js"; // Importa el modelo de listado
import { errorHandler } from "../utils/error.js"; // Importa el manejador de errores personalizado

// Controlador para crear un nuevo listado
export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body); // Crea un nuevo listado con los datos proporcionados en el cuerpo de la solicitud
    return res.status(201).json(listing); // Responde con el listado creado y un código de estado 201 (Created)
  } catch (error) {
    next(error); // Maneja cualquier error y pásalo al siguiente middleware de manejo de errores
  }
};

// Controlador para eliminar un listado existente
export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id); // Busca un listado por su ID
  if (!listing) {
    return next(errorHandler(404, "Apuntes no encontrados")); // Si no se encuentra el listado, maneja el error con un código 404 (Not Found)
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "Solo puedes eliminar uno")); // Verifica si el usuario tiene permiso para eliminar el listado
  }
  try {
    await Listing.findByIdAndDelete(req.params.id); // Elimina el listado encontrado por su ID
    res.status(200).json("Apunte eliminado"); // Responde con un mensaje de éxito y un código de estado 200 (OK)
  } catch (error) {
    next(error); // Maneja cualquier error y pásalo al siguiente middleware de manejo de errores
  }
};

// Controlador para actualizar un listado existente
export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id); // Busca un listado por su ID
  if (!listing) {
    return next(errorHandler(404, "Listing not found!")); // Si no se encuentra el listado, maneja el error con un código 404 (Not Found)
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only update your own listings!")); // Verifica si el usuario tiene permiso para actualizar el listado
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Actualiza el listado encontrado por su ID con los datos proporcionados en el cuerpo de la solicitud
    );
    res.status(200).json(updatedListing); // Responde con el listado actualizado y un código de estado 200 (OK)
  } catch (error) {
    next(error); // Maneja cualquier error y pásalo al siguiente middleware de manejo de errores
  }
};

// Controlador para obtener un listado por su ID
export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id); // Busca un listado por su ID
    if (!listing) {
      return next(errorHandler(404, "Apunte no encontrado")); // Si no se encuentra el listado, maneja el error con un código 404 (Not Found)
    }
    res.status(200).json(listing); // Responde con el listado encontrado y un código de estado 200 (OK)
  } catch (error) {
    next(error); // Maneja cualquier error y pásalo al siguiente middleware de manejo de errores
  }
};

// Controlador para obtener todos los listados con opciones de búsqueda, paginación y ordenamiento
export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10; // Establece un límite de resultados por página (valor predeterminado de 10)
    const startIndex = parseInt(req.query.startIndex) || 0; // Establece el índice de inicio para la paginación (valor predeterminado de 0)

    const searchTerm = req.query.searchTerm || ""; // Término de búsqueda opcional
    const semester = req.query.semester || ""; // Semestre opcional
    const sort = req.query.sort || "createdAt"; // Campo de ordenamiento opcional (predeterminado: createdAt)
    const order = req.query.order || "desc"; // Orden de ordenamiento opcional (predeterminado: descendente)

    // Construye el objeto de búsqueda dinámicamente según los parámetros de consulta proporcionados
    const searchCriteria = {};
    if (searchTerm) {
      searchCriteria.name = { $regex: searchTerm, $options: "i" }; // Realiza una búsqueda de texto insensible a mayúsculas y minúsculas en el nombre del listado
    }
    if (semester) {
      searchCriteria.semester = semester; // Filtra los listados por el semestre especificado
    }

    // Realiza la búsqueda de listados según los criterios de búsqueda, los ordena y aplica la paginación
    const listings = await Listing.find(searchCriteria)
      .sort({ [sort]: order === "desc" ? -1 : 1 }) // Ordena según el campo especificado y el orden proporcionado
      .limit(limit) // Limita el número de resultados devueltos
      .skip(startIndex); // Omite los primeros resultados según el índice de inicio

    return res.status(200).json(listings); // Responde con los listados encontrados y un código de estado 200 (OK)
  } catch (error) {
    next(error); // Maneja cualquier error y pásalo al siguiente middleware de manejo de errores
  }
};
