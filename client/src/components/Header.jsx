import React, { useEffect, useState } from "react"; // Importa React, useEffect y useState desde la biblioteca React
import { IconSearch } from "@tabler/icons-react"; // Importa el ícono de búsqueda de la biblioteca de iconos Tabler
import { Link, useNavigate } from "react-router-dom"; // Importa Link y useNavigate desde react-router-dom para la navegación
import { useSelector } from "react-redux"; // Importa useSelector desde react-redux para acceder al estado global
import Logo from "../assets/img/logo-apuntados.png"; // Importa la imagen del logo desde la ruta especificada
import { IconLogin2 } from "@tabler/icons-react"; // Importa el ícono de inicio de sesión de la biblioteca de iconos Tabler

function Header() {
  const navigate = useNavigate(); // Obtiene la función de navegación navigate desde useNavigate
  const { currentUser } = useSelector((state) => state.user); // Obtiene el usuario actual del estado global utilizando useSelector
  const [searchTerm, setSearchTerm] = useState(""); // Define el estado local searchTerm y su función setter setSearchTerm

  // Función para manejar el envío del formulario de búsqueda
  const handleSubmit = (e) => {
    e.preventDefault(); // Evita el comportamiento predeterminado del formulario
    const urlParams = new URLSearchParams(window.location.search); // Crea un nuevo objeto URLSearchParams con los parámetros de la URL actual
    urlParams.set("searchTerm", searchTerm); // Establece el parámetro "searchTerm" con el valor de searchTerm
    const searchQuery = urlParams.toString(); // Convierte los parámetros a una cadena de consulta
    navigate(`/search?${searchQuery}`); // Navega a la ruta "/search" con la cadena de consulta generada
  };

  // Efecto secundario que se ejecuta cuando cambia location.search
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search); // Crea un nuevo objeto URLSearchParams con los parámetros de la ubicación actual
    const searchTermFromUrl = urlParams.get("searchTerm"); // Obtiene el valor del parámetro "searchTerm" de la URL
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl); // Actualiza el estado local searchTerm con el valor obtenido de la URL
    }
  }, [location.search]); // Dependencia: se ejecuta cuando cambia location.search

  return (
    <header className="bg-[#09090B] shadow-[#1d1d1d] shadow-md">
      {" "}
      {/* Encabezado con clases de estilo para fondo y sombra */}
      <div className="font-inter flex justify-between items-center max-w-6xl mx-auto p-3">
        {" "}
        {/* Contenedor flex con clases de estilo */}
        <Link to="/">
          {" "}
          {/* Enlace al inicio */}
          <img src={Logo} alt="" className="w-auto h-10" />{" "}
          {/* Imagen del logo */}
        </Link>
        <ul className="flex gap-4">
          {" "}
          {/* Lista no ordenada con enlaces de navegación */}
          <Link to="/">
            {" "}
            {/* Enlace a la página de inicio */}
            <li className="hover:text-white text-white/80 transition-colors">
              Inicio
            </li>{" "}
            {/* Elemento de lista para la página de inicio */}
          </Link>
          <Link to="/about">
            {" "}
            {/* Enlace a la página "¿Quiénes somos?" */}
            <li className="hover:text-white text-white/80 transition-colors">
              ¿Quiénes somos?
            </li>{" "}
            {/* Elemento de lista para la página "¿Quiénes somos?" */}
          </Link>
        </ul>
        <div className="flex items-center gap-5 text-white/80">
          {" "}
          {/* Contenedor flex para elementos a la derecha del encabezado */}
          <form
            onSubmit={handleSubmit} // Maneja el envío del formulario de búsqueda
            className="border-x-1 border-y-1 text-white/80 items-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed ring-offset-background border  hover:bg-[#27272A] hover:text-accent-foreground h-10 py-2 px-4 text-muted-foreground hidden w-64 justify-between gap-3 text-sm lg:inline-flex"
          >
            <input
              className="bg-transparent focus:outline-none w-24 sm:w-64 text-white/80" // Campo de entrada para buscar términos
              type="text"
              placeholder="Buscar"
              onChange={(e) => setSearchTerm(e.target.value)} // Maneja el cambio en el campo de entrada de búsqueda
            />
            <IconSearch className="text-white/80" /> {/* Ícono de búsqueda */}
          </form>
          <Link to="/profile">
            {" "}
            {/* Enlace al perfil de usuario */}
            {currentUser ? ( // Si hay un usuario actualmente autenticado
              <img
                className="rounded-full h-7 w-7 object-cover" // Imagen de perfil del usuario
                src={currentUser.avatar}
                alt="profile"
              />
            ) : (
              <div className="focus:bg-accent rounded-lg bg-transparent p-2 text-black duration-300 hover:bg-gray-200 focus:outline-none dark:text-white hover:dark:bg-gray-800">
                <li className="flex gap-2 hover:text-white text-white/80 transition-colors">
                  <IconLogin2 // Ícono de inicio de sesión
                    stroke={2}
                    color="white"
                    className="hover:text-white text-white/80 transition-colors"
                  />
                  Iniciar Sesión {/* Texto "Iniciar Sesión" */}
                </li>
              </div>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header; // Exporta el componente Header como predeterminado
