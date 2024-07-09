import React, { useState } from "react"; // Importa React y useState desde React
import { Link, useNavigate } from "react-router-dom"; // Importa Link y useNavigate desde react-router-dom

function SignUp() {
  const [formData, setFormData] = useState({}); // Estado para almacenar los datos del formulario
  const [error, setError] = useState(null); // Estado para manejar errores durante la solicitud
  const [loading, setLoading] = useState(false); // Estado para controlar el estado de carga
  const navigate = useNavigate(); // Obtiene la función de navegación desde react-router-dom

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
      setLoading(true); // Inicia el estado de carga
      const res = await fetch("/api/auth/signup", {
        // Petición POST a la API para registrarse
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
        setLoading(false); // Detiene el estado de carga
        setError(data.message); // Almacena el mensaje de error recibido
        return;
      }
      setLoading(false); // Detiene el estado de carga
      setError(null); // Limpia cualquier error previo
      navigate("/sign-in"); // Navega a la página de inicio de sesión después de registrarse exitosamente
    } catch (error) {
      setLoading(false); // Detiene el estado de carga
      setError(error.message); // Manejo de errores: almacena el mensaje de error
    }
  };

  console.log(formData); // Muestra formData en la consola (para propósitos de depuración)

  return (
    <div className="font-inter absolute inset-0 -z-10 h-full w-full flex items-center bg-[#09090B]">
      {/* Contenedor principal del formulario de registro */}
      <div className="p-3 max-w-lg mx-auto">
        <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
        {/* Formulario para enviar los datos de registro */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Campos de entrada para nombre de usuario, correo electrónico y contraseña */}
          <input
            type="text"
            placeholder="Username"
            className="border p-3 rounded-lg"
            id="username"
            onChange={handleChange}
          />
          <input
            type="email"
            placeholder="Email"
            className="border p-3 rounded-lg"
            id="email"
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-3 rounded-lg"
            id="password"
            onChange={handleChange}
          />
          {/* Botón para enviar el formulario de registro */}
          <button
            disabled={loading} // Deshabilita el botón si está en estado de carga
            className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Loading" : "Sign Up"}{" "}
            {/* Cambia el texto del botón dependiendo del estado de carga */}
          </button>
        </form>
        {/* Enlace para redirigir a la página de inicio de sesión */}
        <div className="flex gap-2 mt-5">
          <p>¿Tienes cuenta?</p>
          <Link to="/sign-in">
            <span className="text-blue-700">Login</span>
          </Link>
        </div>
        {/* Muestra el mensaje de error si hay algún error */}
        {error && <p className="text-red-500 mt-5">{error}</p>}
      </div>
    </div>
  );
}

export default SignUp; // Exporta el componente SignUp como el componente por defecto
