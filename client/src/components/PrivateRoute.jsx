import React from "react";
import { useSelector } from "react-redux"; // Importa useSelector de react-redux para acceder al estado global
import { Outlet, Navigate } from "react-router-dom"; // Importa Outlet y Navigate de react-router-dom para la gestión de rutas

function PrivateRoute() {
  const { currentUser } = useSelector((state) => state.user); // Extrae currentUser del estado global usando useSelector

  // Retorna el componente Outlet (para renderizar las rutas secundarias) si currentUser existe, de lo contrario navega a la página de inicio de sesión
  return currentUser ? <Outlet /> : <Navigate to="/sign-in" />;
}

export default PrivateRoute; // Exporta el componente PrivateRoute como predeterminado
