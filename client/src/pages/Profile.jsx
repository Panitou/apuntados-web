import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

export default function Profile() {
  const fileRef = useRef(null); // Referencia para el input de archivo
  const { currentUser, loading, error } = useSelector((state) => state.user); // Estado global del usuario actual
  const [file, setFile] = useState(undefined); // Estado para el archivo seleccionado
  const [filePerc, setFilePerc] = useState(0); // Estado para el progreso de la carga del archivo
  const [fileUploadError, setFileUploadError] = useState(false); // Estado para errores de carga de archivos
  const [formData, setFormData] = useState({}); // Estado para los datos del formulario
  const [updateSuccess, setUpdateSuccess] = useState(false); // Estado para el éxito de la actualización de datos
  const [showListingsError, setShowListingsError] = useState(false); // Estado para errores al mostrar los apuntes del usuario
  const [userListings, setUserListings] = useState([]); // Estado para los apuntes del usuario

  const dispatch = useDispatch(); // Función para despachar acciones Redux

  // Efecto para manejar la subida de archivos cuando el estado de 'file' cambia
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  // Función para manejar la subida de archivos a Firebase Storage
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  // Función para manejar cambios en el formulario
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Función para manejar el envío del formulario de actualización de datos
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  // Función para manejar la eliminación de la cuenta de usuario
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  // Función para manejar el cierre de sesión del usuario
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  // Función para mostrar los apuntes del usuario
  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  // Función para eliminar un apunte del usuario
  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="font-inter min-h-screen bg-[#09090B] flex flex-col items-center">
      <div className="p-3 max-w-lg mt-20 mx-auto">
        <h1 className="text-white text-3xl font-semibold text-center my-7">
          Perfil
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-96">
          {/* Input para seleccionar archivo */}
          <input
            onChange={(e) => setFile(e.target.files[0])}
            type="file"
            ref={fileRef}
            hidden
            accept="image/*"
          />
          {/* Vista previa de la imagen de perfil */}
          <img
            onClick={() => fileRef.current.click()}
            src={formData.avatar || currentUser.avatar}
            alt="profile"
            className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
          />
          {/* Mensajes de estado de la carga de archivos */}
          <p className="text-sm self-center">
            {fileUploadError ? (
              <span className="text-red-700">
                Error al subir la imagen (la imagen debe ser menor a 2 MB)
              </span>
            ) : filePerc > 0 && filePerc < 100 ? (
              <span className="text-slate-700">{`Subiendo ${filePerc}%`}</span>
            ) : filePerc === 100 ? (
              <span className="text-green-700">
                ¡Foto actualizada correctamente!
              </span>
            ) : (
              ""
            )}
          </p>
          {/* Campos para actualizar datos personales */}
          <input
            type="text"
            placeholder="Nombre de usuario"
            defaultValue={currentUser.username}
            id="username"
            className="border p-3 rounded-lg"
            onChange={handleChange}
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            id="email"
            defaultValue={currentUser.email}
            className="border p-3 rounded-lg"
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Contraseña"
            onChange={handleChange}
            id="password"
            className="border p-3 rounded-lg"
          />
          {/* Botón para actualizar datos */}
          <button
            disabled={loading}
            className="bg-[#FEC53B] text-[#27272A] font-bold rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Cargando..." : "Actualizar"}
          </button>
          {/* Enlace para crear un nuevo apunte */}
          <Link
            className="bg-[#FEC53B] text-[#27272A] font-bold p-3 rounded-lg uppercase text-center hover:opacity-95"
            to="/create-listing"
          >
            Crear nuevo apunte
          </Link>
        </form>
        {/* Opciones para eliminar cuenta y cerrar sesión */}
        <div className="flex justify-between mt-5">
          <span
            onClick={handleDeleteUser}
            className="text-red-700 cursor-pointer"
          >
            Eliminar cuenta
          </span>
          <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
            Cerrar sesión
          </span>
        </div>

        {/* Mostrar errores y mensajes de éxito */}
        <p className="text-red-700 mt-5">{error ? error : ""}</p>
        <p className="text-green-700 mt-5">
          {updateSuccess ? "¡Datos actualizados correctamente!" : ""}
        </p>

        {/* Botón para mostrar los apuntes del usuario */}
        <button onClick={handleShowListings} className="text-green-700 w-full">
          Ver apuntes
        </button>
        {/* Mensaje de error al mostrar los apuntes */}
        <p className="text-red-700 mt-5">
          {showListingsError ? "Error al mostrar los apuntes" : ""}
        </p>
        {/* Mostrar los apuntes del usuario si existen */}
        {userListings && userListings.length > 0 && (
          <div className="flex flex-col gap-4">
            <h1 className="text-center text-white mt-7 text-2xl font-semibold">
              Tus apuntes
            </h1>
            {/* Iterar y mostrar cada apunte */}
            {userListings.map((listing) => (
              <div
                key={listing._id}
                className="border border-slate-700 rounded-lg p-3 flex justify-between items-center gap-4"
              >
                <Link to={`/listing/${listing._id}`}>
                  {/* Imagen del apunte */}
                  <img
                    src={listing.imageUrls[0]}
                    alt="portada del apunte"
                    className="h-16 w-16 object-contain"
                  />
                </Link>
                {/* Enlace y botones para cada apunte */}
                <Link
                  className="text-white font-semibold  hover:underline truncate flex-1"
                  to={`/listing/${listing._id}`}
                >
                  <p>{listing.name}</p>
                </Link>

                <div className="flex flex-col item-center">
                  {/* Botón para eliminar el apunte */}
                  <button
                    onClick={() => handleListingDelete(listing._id)}
                    className="text-red-700 uppercase text-[13px]"
                  >
                    Eliminar
                  </button>
                  {/* Enlace para editar el apunte */}
                  <Link to={`/update-listing/${listing._id}`}>
                    <button className="text-green-700 uppercase text-[13px]">
                      Editar
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
