import { useEffect, useState } from "react"; // Importa useEffect y useState desde React
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage"; // Importa funciones y objetos relacionados con Firebase Storage
import { app } from "../firebase"; // Importa la configuración de Firebase desde el archivo firebase.js
import { useSelector } from "react-redux"; // Importa useSelector desde react-redux para acceder al estado global
import { useNavigate, useParams } from "react-router-dom"; // Importa useNavigate y useParams desde react-router-dom

export default function UpdateListing() {
  const { currentUser } = useSelector((state) => state.user); // Obtiene el usuario actual del estado global
  const navigate = useNavigate(); // Obtiene la función de navegación desde react-router-dom
  const params = useParams(); // Obtiene los parámetros de la URL usando useParams
  const [files, setFiles] = useState([]); // Estado para almacenar los archivos seleccionados
  const [formData, setFormData] = useState({
    // Estado para almacenar los datos del formulario
    imageUrls: [], // URLs de las imágenes
    name: "", // Nombre del apunte
    description: "", // Descripción del apunte
    course: "", // Curso del apunte
    price: 10, // Precio del apunte (inicializado en 10)
    semester: "", // Ciclo del apunte
  });
  const [imageUploadError, setImageUploadError] = useState(false); // Estado para manejar errores de carga de imágenes
  const [uploading, setUploading] = useState(false); // Estado para controlar el estado de carga de imágenes
  const [error, setError] = useState(false); // Estado para manejar errores generales
  const [loading, setLoading] = useState(false); // Estado para controlar el estado de carga general

  useEffect(() => {
    // Efecto para cargar los datos del listado
    const fetchListing = async () => {
      const listingId = params.listingId; // Obtiene el ID del listado desde los parámetros de la URL
      const res = await fetch(`/api/listing/get/${listingId}`); // Realiza una solicitud GET para obtener el listado específico
      const data = await res.json(); // Convierte la respuesta a formato JSON
      if (data.success === false) {
        console.log(data.message); // Si no se encuentra el listado, muestra un mensaje de error en la consola
        return;
      }
      setFormData(data); // Actualiza el estado formData con los datos del listado
    };

    fetchListing(); // Llama a la función para cargar los datos del listado al montar el componente
  }, []); // La dependencia vacía asegura que este efecto se ejecute solo una vez al montar el componente

  // Función para manejar la subida de imágenes
  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      // Verifica si se han seleccionado archivos y si no se excede el límite de 6 imágenes por listado
      setUploading(true); // Establece el estado de carga de imágenes como verdadero
      setImageUploadError(false); // Limpia cualquier error de carga de imágenes

      const promises = []; // Arreglo para almacenar las promesas de carga de imágenes

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i])); // Agrega cada imagen al arreglo de promesas para su carga
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls), // Concatena los URLs de las imágenes cargadas al estado formData
          });
          setImageUploadError(false); // Limpia cualquier error de carga de imágenes
          setUploading(false); // Establece el estado de carga de imágenes como falso
        })
        .catch((err) => {
          setImageUploadError("Image upload failed (2 mb max per image)"); // Establece el mensaje de error si falla la carga de imágenes
          setUploading(false); // Establece el estado de carga de imágenes como falso
        });
    } else {
      setImageUploadError("You can only upload 6 images per listing"); // Establece el mensaje de error si se excede el límite de 6 imágenes por listado
      setUploading(false); // Establece el estado de carga de imágenes como falso
    }
  };

  // Función para almacenar una imagen en Firebase Storage
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app); // Obtiene la instancia de Firebase Storage
      const fileName = new Date().getTime() + file.name; // Genera un nombre único para el archivo basado en la fecha y nombre original
      const storageRef = ref(storage, fileName); // Crea una referencia al archivo en Firebase Storage
      const uploadTask = uploadBytesResumable(storageRef, file); // Inicia la carga del archivo a través de una tarea resumible

      // Eventos de la tarea de carga del archivo
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100; // Calcula el progreso de la carga en porcentaje
          console.log(`Upload is ${progress}% done`); // Muestra el progreso de la carga en la consola
        },
        (error) => {
          reject(error); // Rechaza la promesa si hay un error durante la carga del archivo
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL); // Resuelve la promesa con el URL de descarga del archivo
          });
        }
      );
    });
  };

  // Función para manejar cambios en los campos del formulario
  const handleChange = (e) => {
    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value, // Actualiza el estado formData con el valor del campo modificado
      });
    }
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario
    try {
      setLoading(true); // Establece el estado de carga como verdadero
      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        // Realiza una solicitud POST para actualizar el listado específico
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id, // Incluye la referencia del usuario actual en los datos del formulario
        }),
      });
      const data = await res.json(); // Convierte la respuesta a formato JSON
      setLoading(false); // Establece el estado de carga como falso
      if (data.success === false) {
        setError(data.message); // Establece el mensaje de error si la actualización falla
      }
      navigate(`/listing/${data._id}`); // Navega a la página del listado actualizado después de una actualización exitosa
    } catch (error) {
      setError(error.message); // Manejo de errores: establece el mensaje de error
      setLoading(false); // Establece el estado de carga como falso
    }
  };

  // Renderiza la interfaz de usuario del componente UpdateListing
  return (
    <main className="p-3 w-full font-inter min-h-screen bg-[#09090B] flex flex-col items-center">
      <h1 className="text-3xl text-white font-semibold text-center my-7">
        Actualizar apunte
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          {/* Campos de entrada para el título, la descripción, el curso, el ciclo y el precio del listado */}
          <input
            type="text"
            placeholder="Titulo"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            type="text"
            placeholder="Descripcion"
            className="border p-3 rounded-lg"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Curso"
            className="border p-3 rounded-lg"
            id="address" // Supongo que este debe ser "course" en lugar de "address"
            required
            onChange={handleChange}
            value={formData.course}
          />
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="semester"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.semester}
              />
              <p className="text-white">Ciclo</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="price"
                min="10"
                max="10000000"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.price}
              />
              <p className="text-white">Soles</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          {/* Sección para la carga y visualización de imágenes */}
          <p className="font-semibold text-white">
            Archivos:
            <span className="font-normal text-[#A1A1AA] ml-2">
              Soporta hasta 6 archivos
            </span>
          </p>
          <div className="flex-col gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)} // Maneja el cambio en la selección de archivos
              className="p-3 border bg-white border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              disabled={uploading}
              onClick={handleImageSubmit} // Maneja la subida de imágenes al hacer clic en el botón
              className="p-3 text-[#09090B] bg-[#FEC53B] rounded uppercase hover:shadow-lg disabled:opacity-80 mt-4 font-semibold w-full"
            >
              {uploading ? "Cargando..." : "Cargar"}
            </button>
          </div>
          <p className="text-red-700 text-sm">
            {imageUploadError && imageUploadError}{" "}
            {/* Muestra el mensaje de error de carga de imágenes */}
          </p>
          {/* Muestra las imágenes cargadas con la opción de eliminar cada una */}
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className="flex justify-between p-3 border-white border-2 rounded-xl items-center"
              >
                <img
                  src={url}
                  alt="listing image"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)} // Maneja la eliminación de imágenes al hacer clic en el botón
                  className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                >
                  Eliminar
                </button>
              </div>
            ))}
          {/* Botón para enviar el formulario de actualización */}
          <button
            disabled={loading || uploading} // Deshabilita el botón si está en estado de carga o carga de imágenes
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Actualizando..." : "Actualizar apunte"}
          </button>
          {/* Muestra el mensaje de error si hay algún error durante la actualización */}
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}
