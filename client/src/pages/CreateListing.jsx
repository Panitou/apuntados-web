import { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function CreateListing() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user); // Obtiene el usuario actual del estado global usando useSelector
  const [files, setFiles] = useState([]); // Estado para almacenar archivos seleccionados por el usuario
  const [formData, setFormData] = useState({
    // Estado para almacenar los datos del formulario del nuevo apunte
    imageUrls: [], // Arreglo para almacenar URLs de las imágenes subidas
    name: "", // Nombre del apunte
    description: "", // Descripción del apunte
    course: "", // Curso relacionado al apunte
    semester: 1, // Ciclo del apunte (por defecto 1)
    price: 10, // Precio del apunte (por defecto 10)
  });
  const [imageUploadError, setImageUploadError] = useState(false); // Estado para manejar errores de carga de imágenes
  const [uploading, setUploading] = useState(false); // Estado para indicar si se está realizando la carga de imágenes
  const [error, setError] = useState(false); // Estado para manejar errores generales
  const [loading, setLoading] = useState(false); // Estado para indicar si se está procesando la creación del apunte

  // Maneja la subida de imágenes al almacenamiento de Firebase
  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError(
            "La carga de imágenes falló (máx. 2 MB por imagen)"
          );
          setUploading(false);
        });
    } else {
      setImageUploadError("Solo puedes subir 6 imágenes por apunte");
      setUploading(false);
    }
  };

  // Función para almacenar una imagen en Firebase Storage
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name; // Nombre único para la imagen
      const storageRef = ref(storage, fileName); // Referencia al almacenamiento en Firebase
      const uploadTask = uploadBytesResumable(storageRef, file); // Tarea de carga de bytes resumible

      // Escucha los cambios de estado durante la carga de la imagen
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Subida ${progress}% completada`);
        },
        (error) => {
          reject(error);
        },
        () => {
          // Cuando la carga se completa exitosamente, obtén la URL de descarga y resuelve la promesa
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  // Maneja la eliminación de una imagen del arreglo de imágenes subidas
  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  // Maneja el cambio en los campos de texto/número del formulario
  const handleChange = (e) => {
    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  // Maneja el envío del formulario para crear un nuevo apunte
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Verifica que se haya subido al menos una imagen
      if (formData.imageUrls.length < 1) {
        setError("Debes subir por lo menos una imagen");
        setLoading(false);
        return;
      }

      // Realiza una solicitud POST al servidor para crear el apunte
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id, // Añade la referencia del usuario actual al cuerpo de la solicitud
        }),
      });

      // Parsea la respuesta como JSON
      const data = await res.json();

      // Finaliza el estado de carga
      setLoading(false);

      // Si la creación del apunte fue exitosa, navega a la página del apunte creado
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      // Maneja los errores generales durante el proceso de creación del apunte
      setError(error.message);
      setLoading(false);
    }
  };

  // Renderiza el formulario de creación de apunte
  return (
    <main className="p-3 w-full font-inter min-h-screen bg-[#09090B] flex flex-col items-center">
      <h1 className="text-3xl text-white font-semibold text-center my-7">
        Crear apunte
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
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
            placeholder="Descripción"
            className="border p-3 rounded-lg"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          ></textarea>
          <input
            type="text"
            placeholder="Curso"
            className="border p-3 rounded-lg"
            id="course"
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
                min="20"
                max="10000000"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.price}
              />
              <div className="text-white">
                <p>Soles</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold text-white">
            Archivos:
            <span className="font-normal text-[#A1A1AA] ml-2">
              Soporta hasta 6 archivos
            </span>
          </p>
          <div className="flex-col gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              className="p-3 border bg-white border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*,.pdf"
              multiple
            />
            <button
              type="button"
              disabled={uploading}
              onClick={handleImageSubmit}
              className="p-3 text-[#09090B] bg-[#FEC53B] rounded uppercase hover:shadow-lg disabled:opacity-80 mt-4 font-semibold w-full"
            >
              {uploading ? "Cargando..." : "Cargar"}
            </button>
          </div>
          <p className="text-red-700 text-sm">
            {imageUploadError && imageUploadError}
          </p>
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
                  onClick={() => handleRemoveImage(index)}
                  className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                >
                  Eliminar
                </button>
              </div>
            ))}
          <button
            disabled={loading || uploading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Creando..." : "Crear el apunte"}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}

export default CreateListing;
