import React from "react";
import { Link } from "react-router-dom"; // Importa Link desde react-router-dom para crear enlaces
import { MdLocationOn } from "react-icons/md"; // Importa el ícono de ubicación desde react-icons/md

function ListingItem({ listing }) {
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]">
      <Link to={`/listing/${listing._id}`}>
        {" "}
        {/* Enlace dinámico al detalle del listado */}
        <img
          src={listing.imageUrls[0]} // URL de la primera imagen del listado
          alt="listing cover" // Texto alternativo para accesibilidad
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300" // Estilos para la imagen con efectos de hover
        />
        <div className="p-3">
          {" "}
          {/* Contenedor para información del listado */}
          <p className="truncate text-lg font-semibold text-slate-700">
            {listing.name} {/* Nombre del listado */}
          </p>
          <p className="text-sm text-gray-600 line-clamp-2">
            {listing.description}{" "}
            {/* Descripción del listado con truncamiento */}
          </p>
          <p className="font-bold text-lg">Precio: {listing.price}</p>{" "}
          {/* Precio del listado */}
          <div className="text-slate-700 flex gap-4">
            {" "}
            {/* Información adicional */}
            <div className="font-bold text-sx">
              Ciclo: {listing.semester}
            </div>{" "}
            {/* Semestre del listado */}
            <div className="font-bold text-sx">
              Curso: {listing.course}
            </div>{" "}
            {/* Curso del listado */}
          </div>
        </div>
      </Link>
    </div>
  );
}

export default ListingItem; // Exporta el componente ListingItem como predeterminado
