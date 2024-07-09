// Función para crear un objeto de error con un código de estado y un mensaje
export const errorHandler = (statusCode, message) => {
  const error = new Error(); // Crea una nueva instancia de Error
  error.statusCode = statusCode; // Asigna el código de estado al objeto de error
  error.message = message; // Asigna el mensaje al objeto de error
  return error; // Devuelve el objeto de error creado
};
