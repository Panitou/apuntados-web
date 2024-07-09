import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { useSelector } from "react-redux";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
import { IconCertificate } from "@tabler/icons-react";

export default function Listing() {
  const [listing, setListing] = useState(null); // Estado para almacenar los detalles del apunte
  const [loading, setLoading] = useState(false); // Estado para manejar el estado de carga
  const [error, setError] = useState(false); // Estado para manejar errores
  const [copied, setCopied] = useState(false); // Estado para indicar si se ha copiado el enlace
  const [contact, setContact] = useState(false); // Estado para manejar el estado de contacto
  const params = useParams(); // Obtiene los parámetros de la URL utilizando useParams()
  const { currentUser } = useSelector((state) => state.user); // Obtiene el usuario actual del estado global usando useSelector

  // Efecto para cargar los detalles del apunte basado en params.listingId
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`); // Hace una solicitud GET a la API para obtener los detalles del apunte
        const data = await res.json();
        if (data.success === false) {
          setError(true); // Establece error a true si la solicitud no fue exitosa
          setLoading(false);
          return;
        }
        setListing(data); // Establece los datos del apunte en el estado listing
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true); // Maneja errores de red o de la API
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]); // Se ejecuta cuando params.listingId cambia

  // Renderiza el contenido principal basado en el estado de carga y error
  return (
    <main className="p-10 flex justify-center min-h-screen bg-[#09090B] items-center">
      {/* Muestra un mensaje de carga */}
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {/* Muestra un mensaje de error */}
      {error && (
        <p className="text-center my-7 text-2xl">Something went wrong!</p>
      )}
      {/* Muestra los detalles del apunte si no hay carga ni error */}
      {listing && !loading && !error && (
        <div className="h-[550px] w-[500px]">
          {/* Componente Swiper para las imágenes del apunte */}
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px] w-[500px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          {/* Componentes opcionales para compartir y mostrar mensajes */}
          {/* <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
            <FaShare
              className="text-slate-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
              Link copied!
            </p>
          )} */}
        </div>
      )}
      {/* Muestra los detalles del apunte (nombre, curso, descripción, etc.) */}
      {listing && !loading && !error && (
        <div className="flex flex-col max-w-4xl p-3 my-7 gap-4 mx-7">
          <p className="text-4xl font-semibold text-white">{listing.name}</p>
          <p className="flex items-center mt-2 gap-2 text-white text-sm">
            <IconCertificate stroke={2} color="white" />
            {listing.course}
          </p>
          {/* Descripción del apunte */}
          <p className="text-white h-8 w-full bg-white rounded-lg flex flex-col items-center justify-center">
            <span className="font-semibold text-[#09090B]">Description: </span>
          </p>
          <p className="text-white">{listing.description}</p>
          {/* Detalles adicionales como ciclo y precio */}
          <ul className="text-[#09090B] font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6 mt-2">
            <li className="flex items-center gap-1 whitespace-nowrap bg-[#E691B5] w-16 h-8 rounded-lg justify-center">
              <span>Ciclo</span>
              {listing.semester}
            </li>
            <li className="flex items-center gap-1 whitespace-nowrap bg-[#E691B5] w-24 h-8 rounded-lg justify-center">
              <span>Precio</span>
              {listing.price}
            </li>
          </ul>
          {/* Botón para contactar */}
          <button
            onClick={() => setContact(true)}
            className="bg-[#FEC53B] text-[#09090B] font-bold rounded-lg uppercase hover:opacity-95 p-3"
          >
            Contactar
          </button>
        </div>
      )}
    </main>
  );
}
