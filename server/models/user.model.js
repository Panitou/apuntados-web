import mongoose from "mongoose";

// Define el esquema de Mongoose para el modelo User
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true, // Indica que el nombre de usuario debe ser único en la base de datos
    },
    email: {
      type: String,
      required: true,
      unique: true, // Indica que el correo electrónico debe ser único en la base de datos
    },
    password: {
      type: String,
      required: true,
      unique: true, // Indica que la contraseña debe ser única en la base de datos
    },
    avatar: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/thumbnails/005/129/844/small_2x/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg",
      // Valor por defecto para el avatar del usuario, en caso de no ser proporcionado
    },
  },
  {
    timestamps: true, // Opciones adicionales del esquema, en este caso para registrar timestamps
  }
);

// Crea el modelo User basado en el esquema userSchema
const User = mongoose.model("User", userSchema);

// Exporta el modelo User para que pueda ser utilizado en otros archivos
export default User;
