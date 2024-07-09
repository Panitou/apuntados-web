import { createSlice } from "@reduxjs/toolkit"; // Importa createSlice desde Redux Toolkit

const initialState = {
  currentUser: null, // Estado inicial para almacenar el usuario actual
  error: null, // Estado inicial para manejar errores
  loading: false, // Estado inicial para controlar el estado de carga
};

const userSlice = createSlice({
  name: "user", // Nombre del slice
  initialState, // Estado inicial definido anteriormente
  reducers: {
    // Reductores para manejar acciones relacionadas con el usuario

    // Acción para iniciar sesión
    signInStart: (state) => {
      state.loading = true; // Establece loading en true al iniciar sesión
    },
    // Acción para manejar inicio de sesión exitoso
    signInSuccess: (state, action) => {
      state.currentUser = action.payload; // Actualiza currentUser con los datos del usuario
      state.loading = false; // Establece loading en false después de iniciar sesión
      state.error = null; // Limpia cualquier error existente
    },
    // Acción para manejar fallos en inicio de sesión
    signInFailure: (state, action) => {
      state.error = action.payload; // Establece el error con el mensaje proporcionado
      state.loading = false; // Establece loading en false después de un fallo en inicio de sesión
    },
    // Acción para iniciar actualización de usuario
    updateUserStart: (state) => {
      state.loading = true; // Establece loading en true al iniciar la actualización de usuario
    },
    // Acción para manejar actualización de usuario exitosa
    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload; // Actualiza currentUser con los datos actualizados del usuario
      state.loading = false; // Establece loading en false después de una actualización exitosa
      state.error = null; // Limpia cualquier error existente
    },
    // Acción para manejar fallos en actualización de usuario
    updateUserFailure: (state, action) => {
      state.error = action.payload; // Establece el error con el mensaje proporcionado
      state.loading = false; // Establece loading en false después de un fallo en actualización de usuario
    },
    // Acción para iniciar eliminación de usuario
    deleteUserStart: (state) => {
      state.loading = true; // Establece loading en true al iniciar la eliminación de usuario
    },
    // Acción para manejar eliminación de usuario exitosa
    deleteUserSuccess: (state) => {
      state.currentUser = null; // Elimina currentUser al eliminar el usuario
      state.loading = false; // Establece loading en false después de una eliminación exitosa
      state.error = null; // Limpia cualquier error existente
    },
    // Acción para manejar fallos en eliminación de usuario
    deleteUserFailure: (state, action) => {
      state.error = action.payload; // Establece el error con el mensaje proporcionado
      state.loading = false; // Establece loading en false después de un fallo en eliminación de usuario
    },
    // Acción para iniciar sesión de usuario
    signOutUserStart: (state) => {
      state.loading = true; // Establece loading en true al iniciar la sesión de usuario
    },
    // Acción para manejar cierre de sesión de usuario exitoso
    signOutUserSuccess: (state) => {
      state.currentUser = null; // Elimina currentUser al cerrar la sesión de usuario
      state.loading = false; // Establece loading en false después de un cierre de sesión exitoso
      state.error = null; // Limpia cualquier error existente
    },
    // Acción para manejar fallos en cierre de sesión de usuario
    signOutUserFailure: (state, action) => {
      state.error = action.payload; // Establece el error con el mensaje proporcionado
      state.loading = false; // Establece loading en false después de un fallo en cierre de sesión de usuario
    },
  },
});

// Exporta los reductores y acciones generadas por createSlice
export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} = userSlice.actions;

// Exporta el reductor generado por createSlice
export default userSlice.reducer;
