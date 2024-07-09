import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem.jsx";

function Search() {
  const navigate = useNavigate(); // Hook para navegación programática
  const [loading, setLoading] = useState(false); // Estado de carga
  const [listings, setListings] = useState([]); // Estado para almacenar listados de apuntes
  const [showMore, setShowMore] = useState(false); // Estado para controlar la carga de más listados
  const [sidebardata, setSidebardata] = useState({
    // Estado para los datos de la barra lateral (filtros)
    searchTerm: "",
    semester: "",
    sort: "created_at",
    order: "desc",
  });

  // Función para manejar cambios en los campos de entrada y selectores
  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }
    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";
      const order = e.target.value.split("_")[1] || "desc";
      setSidebardata({ ...sidebardata, sort, order });
    }
    if (e.target.id === "semester") {
      const semester = e.target.value.split("_")[0] || "I";
      setSidebardata({ ...sidebardata, semester });
    }
  };

  // Función para manejar el envío del formulario de filtros
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebardata.searchTerm);
    urlParams.set("semester", sidebardata.semester);
    urlParams.set("sort", sidebardata.sort);
    urlParams.set("order", sidebardata.order);
    const searchQuery = urlParams.toString();
    // Navega a la ruta de búsqueda con los parámetros de búsqueda
    navigate(`/search?${searchQuery}`);
  };

  // Efecto que se ejecuta cuando cambia la búsqueda (location.search)
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const semesterFromUrl = urlParams.get("semester");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    // Actualiza sidebardata con los parámetros de búsqueda de la URL si existen
    if (searchTermFromUrl || semesterFromUrl || sortFromUrl || orderFromUrl) {
      setSidebardata({
        searchTerm: searchTermFromUrl || "",
        semester: semesterFromUrl || "",
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }

    // Función asincrónica para obtener listados de apuntes
    const fetchListings = async () => {
      setLoading(true); // Marca como cargando
      setShowMore(false); // Oculta el botón de "Mostrar más"
      const searchQuery = urlParams.toString(); // Crea la cadena de consulta para la API
      const res = await fetch(`/api/listing/get?${searchQuery}`); // Llama a la API con los parámetros de búsqueda
      const data = await res.json(); // Convierte la respuesta a formato JSON
      if (data.length > 8) {
        setShowMore(true); // Muestra el botón de "Mostrar más" si hay más de 8 resultados
      } else {
        setShowMore(false); // Oculta el botón si no hay más de 8 resultados
      }
      setListings(data); // Actualiza el estado con los listados obtenidos
      setLoading(false); // Marca como no cargando
    };

    fetchListings(); // Llama a la función para obtener listados al montar el componente o al cambiar la búsqueda
  }, [location.search]); // Dependencia: cambia cuando cambia location.search

  // Función para cargar más listados al hacer clic en "Mostrar más"
  const onShowMoreClick = async () => {
    const numberOfListing = listings.length;
    const startIndex = numberOfListing;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false); // Oculta el botón de "Mostrar más" si no hay más listados disponibles
    }
    setListings([...listings, ...data]); // Agrega los nuevos listados al estado existente
  };

  return (
    <div className="flex flex-col md:flex-row font-semibold w-full font-inter min-h-screen bg-[#09090B]">
      {/* Sección del formulario de filtros */}
      <div className="p-7 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap text-white">
              Buscar por término:
            </label>
            <input
              id="searchTerm"
              type="text"
              placeholder="Buscar..."
              className=" rounded-lg p-3 w-52"
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center rounded-lg">
            <label className="text-white">Ciclo:</label>
            <div className="flex gap-2">
              {/* Selector para el ciclo académico */}
              <select
                id="semester"
                className="w-15 h-10 text-center rounded-lg"
                onChange={handleChange}
                defaultValue={"I"}
              >
                <option value="I">I</option>
                <option value="II">II</option>
                <option value="III">III</option>
                <option value="IV">IV</option>
                <option value="V">V</option>
                <option value="VI">VI</option>
                <option value="VII">VII</option>
                <option value="VIII">VIII</option>
                <option value="IX">IX</option>
                <option value="X">X</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <label className="text-white">Orden:</label>
            <div className="flex gap-2">
              {/* Selector para el orden de los listados */}
              <select
                id="sort_order"
                className="border rounded-lg p-3"
                onChange={handleChange}
                defaultValue={"created_at_desc"}
              >
                <option value="createdAt_desc">Últimos</option>
                <option value="regularPrice_desc">Antiguos</option>
              </select>
            </div>
          </div>
          {/* Botón para aplicar los filtros */}
          <button className="bg-[#FEC53B] text-[#09090B] font-bold p-3 rounded-lg uppercase hover:opacity-95">
            Aplicar filtros
          </button>
        </form>
      </div>

      {/* Sección de resultados de búsqueda */}
      <div className="">
        <h1 className="text-3xl font-semibold text-white m-7">Resultados:</h1>
        <div className="p-7 flex flex-wrap gap-4">
          {/* Mensaje si no hay listados */}
          {!loading && listings.length === 0 && (
            <p className="text-xl text-white">No se encontraron apuntes</p>
          )}
          {/* Mensaje de carga */}
          {loading && (
            <p className="text-xl text-slate-700 text-center w-full">
              Cargando
            </p>
          )}
          {/* Mapeo y renderizado de listados */}
          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}
          {/* Botón para cargar más listados */}
          {showMore && (
            <button
              onClick={onShowMoreClick}
              className="text-green-700 hover:underline p-7 text-center w-full"
            >
              Mostrar más
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Search;
