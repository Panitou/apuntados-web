import User from "../models/user.model.js"; // Importa el modelo de usuario
import bcryptjs from "bcryptjs"; // Importa bcryptjs para el hashing de contraseñas
import { errorHandler } from "../utils/error.js"; // Importa el manejador de errores personalizado
import jwt from "jsonwebtoken"; // Importa jwt para la generación de tokens JWT

// Controlador para registrar un nuevo usuario
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body; // Extrae el nombre de usuario, correo electrónico y contraseña del cuerpo de la solicitud
  const hashedPassword = bcryptjs.hashSync(password, 10); // Genera un hash de la contraseña utilizando bcryptjs
  const newUser = new User({ username, email, password: hashedPassword }); // Crea una nueva instancia de usuario con el nombre de usuario, correo electrónico y contraseña hasheada

  try {
    await newUser.save(); // Guarda el nuevo usuario en la base de datos
    res.status(201).json("User created successfully"); // Responde con un mensaje de éxito y un código de estado 201 (Created)
  } catch (error) {
    next(error); // Maneja cualquier error y pásalo al siguiente middleware de manejo de errores
    // res.status(500).json(error.message);  // En caso de error, responde con un mensaje de error y un código de estado 500 (Internal Server Error)
  }
};

// Controlador para iniciar sesión de usuario
export const signin = async (req, res, next) => {
  const { email, password } = req.body; // Extrae el correo electrónico y la contraseña del cuerpo de la solicitud

  try {
    const validUser = await User.findOne({ email: email }); // Busca un usuario por su correo electrónico en la base de datos
    if (!validUser) return next(errorHandler(404, "User not found")); // Si no se encuentra el usuario, maneja el error con un código 404 (Not Found)

    const validPassword = bcryptjs.compareSync(password, validUser.password); // Compara la contraseña proporcionada con la contraseña almacenada del usuario
    if (!validPassword) return next(errorHandler(401, "Wrong credentials")); // Si la contraseña no es válida, maneja el error con un código 401 (Unauthorized)

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET); // Genera un token JWT con el ID del usuario y una clave secreta
    const { password: pass, ...rest } = validUser._doc; // Excluye la contraseña del usuario de la respuesta

    res
      .cookie("access_token", token, { httpOnly: true }) // Establece una cookie HTTPOnly con el token JWT para autenticación de sesión
      .status(200)
      .json(rest); // Responde con los datos del usuario (excluyendo la contraseña) y un código de estado 200 (OK)
  } catch (error) {
    next(error); // Maneja cualquier error y pásalo al siguiente middleware de manejo de errores
  }
};

// Controlador para autenticación con Google
export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email }); // Busca un usuario por su correo electrónico en la base de datos

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET); // Si el usuario existe, genera un token JWT con el ID del usuario y una clave secreta
      const { password: pass, ...rest } = user._doc; // Excluye la contraseña del usuario de la respuesta

      res
        .cookie("access_token", token, { httpOnly: true }) // Establece una cookie HTTPOnly con el token JWT para autenticación de sesión
        .status(200)
        .json(rest); // Responde con los datos del usuario (excluyendo la contraseña) y un código de estado 200 (OK)
    } else {
      // Si el usuario no existe, crea un nuevo usuario con datos proporcionados por Google
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      const newUser = new User({
        username:
          req.body.name.split("").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });

      await newUser.save(); // Guarda el nuevo usuario en la base de datos
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET); // Genera un token JWT con el ID del nuevo usuario y una clave secreta
      const { password: pass, ...rest } = newUser._doc; // Excluye la contraseña del nuevo usuario de la respuesta

      res
        .cookie("access_token", token, { httpOnly: true }) // Establece una cookie HTTPOnly con el token JWT para autenticación de sesión
        .status(200)
        .json(rest); // Responde con los datos del nuevo usuario (excluyendo la contraseña) y un código de estado 200 (OK)
    }
  } catch (error) {
    next(error); // Maneja cualquier error y pásalo al siguiente middleware de manejo de errores
  }
};

// Controlador para cerrar sesión de usuario
export const signOut = async (req, res, next) => {
  try {
    res.clearCookie("access_token"); // Borra la cookie de acceso para cerrar sesión
    res.status(200).json("User has been logged out!"); // Responde con un mensaje de éxito y un código de estado 200 (OK)
  } catch (error) {
    next(error); // Maneja cualquier error y pásalo al siguiente middleware de manejo de errores
  }
};
