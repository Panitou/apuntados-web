import React, { useState } from "react"; // Importa React y useState desde React
import { Link, useNavigate } from "react-router-dom"; // Importa Link y useNavigate desde react-router-dom
import { useDispatch, useSelector } from "react-redux"; // Importa useDispatch y useSelector desde react-redux
import userSlice, { // Importa userSlice y acciones relacionadas desde "../redux/user/userSlice.js"
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice.js";
import { IconLogin2 } from "@tabler/icons-react"; // Importa IconLogin2 desde @tabler/icons-react
import OAuth from "../components/OAuth.jsx"; // Importa el componente OAuth desde "../components/OAuth.jsx"

function SignIn() {
  const [formData, setFormData] = useState({}); // Estado para almacenar los datos del formulario
  const { loading, error } = useSelector((state) => state.user); // Obtiene loading y error desde el estado global usando useSelector
  const navigate = useNavigate(); // Obtiene la función de navegación desde react-router-dom
  const dispatch = useDispatch(); // Obtiene la función dispatch desde react-redux

  // Función para manejar cambios en los campos del formulario
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario
    try {
      dispatch(signInStart()); // Dispatch de la acción signInStart para indicar inicio de sesión
      const res = await fetch("/api/auth/signin", {
        // Petición POST a la API para iniciar sesión
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Cuerpo de la solicitud con los datos del formulario en formato JSON
      });
      const data = await res.json(); // Convierte la respuesta de la API a formato JSON
      console.log(data); // Muestra la respuesta en la consola (para propósitos de depuración)
      if (data.success === false) {
        // Si la respuesta indica fallo
        dispatch(signInFailure(data.message)); // Dispatch de la acción signInFailure con el mensaje de error
        return;
      }
      dispatch(signInSuccess(data)); // Dispatch de la acción signInSuccess con los datos del usuario
      navigate("/"); // Navega a la página de inicio después de iniciar sesión exitosamente
    } catch (error) {
      dispatch(signInFailure(error.message)); // Manejo de errores: dispatch de signInFailure con el mensaje de error
    }
  };

  console.log(formData); // Muestra formData en la consola (para propósitos de depuración)

  return (
    <div className="font-inter absolute inset-0 -z-10 h-full w-full flex items-center bg-[#09090B]">
      {/* Contenedor principal del formulario de inicio de sesión */}
      <div className="p-3 max-w-lg mx-auto">
        <h1 className="text-3xl text-white text-center font-semibold mb-3">
          Iniciar Sesión
        </h1>
        <p className="text-[#A1A1AA] pb-3">
          Recuerda iniciar sesión con tu cuenta institucional
        </p>
        {/* Formulario para enviar los datos de inicio de sesión */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <OAuth />{" "}
          {/* Componente OAuth para opciones de inicio de sesión externas */}
        </form>
      </div>
    </div>
  );
}

export default SignIn; // Exporta el componente SignIn como el componente por defecto
