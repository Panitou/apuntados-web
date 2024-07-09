import React from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth"; // Importa Firebase para la autenticación con Google
import { app } from "../firebase.js"; // Importa la configuración de Firebase desde un archivo firebase.js
import { useDispatch } from "react-redux"; // Importa useDispatch de react-redux para manejar acciones
import { signInSuccess } from "../redux/user/userSlice.js"; // Importa la acción signInSuccess desde userSlice.js en Redux
import { useNavigate } from "react-router-dom"; // Importa useNavigate de react-router-dom para navegación programática
import { IconBrandGoogle } from "@tabler/icons-react"; // Importa el ícono de Google desde @tabler/icons-react

function OAuth() {
  const dispatch = useDispatch(); // Inicializa useDispatch para despachar acciones de Redux
  const navigate = useNavigate(); // Inicializa useNavigate para navegar programáticamente

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider(); // Crea una instancia del proveedor de autenticación de Google
      const auth = getAuth(app); // Obtiene la instancia de autenticación de Firebase usando la configuración de la app Firebase
      const result = await signInWithPopup(auth, provider); // Inicia sesión con Google mediante un popup de autenticación

      // Envía los datos de usuario autenticado a tu API backend
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName, // Nombre del usuario autenticado
          email: result.user.email, // Correo electrónico del usuario autenticado
          photo: result.user.photoURL, // URL de la foto de perfil del usuario autenticado
        }),
      });

      const data = await res.json(); // Parsea la respuesta de la API backend
      dispatch(signInSuccess(data)); // Despacha la acción signInSuccess con los datos del usuario autenticado a Redux
      navigate("/"); // Navega a la página principal después de la autenticación exitosa
    } catch (error) {
      console.log("could not sign in with google", error); // Maneja errores de inicio de sesión con Google
    }
  };

  return (
    <div className="text-white mx-auto rounded-md duration-300 hover:shadow-[0_0_2rem_-0.5rem_#3178c6]">
      <button
        onClick={handleGoogleClick} // Maneja el clic en el botón para iniciar sesión con Google
        className="items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed ring-offset-background border border-x-white border-y-white hover:text-accent-foreground h-10 py-2 px-4 fancy-border-gradient hover:bg-background relative mx-auto flex gap-2"
      >
        <IconBrandGoogle stroke={2} width={20} /> {/* Ícono de Google */}
        Continuar con Google
      </button>
    </div>
  );
}

export default OAuth; // Exporta el componente OAuth como predeterminado
