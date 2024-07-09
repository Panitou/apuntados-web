import React from "react"; // Importa React desde la biblioteca react
import ReactDOM from "react-dom/client"; // Importa ReactDOM desde la biblioteca react-dom/client
import App from "./App.jsx"; // Importa el componente raíz de la aplicación desde App.jsx
import "./index.css"; // Importa estilos CSS desde index.css
import { persistor, store } from "./redux/store.js"; // Importa el store y persistor desde redux/store.js
import { Provider } from "react-redux"; // Importa Provider desde react-redux para proporcionar el store a la aplicación React
import { PersistGate } from "redux-persist/integration/react"; // Importa PersistGate desde redux-persist/integration/react para manejar la persistencia del estado

// Renderiza la aplicación dentro del elemento con el ID "root"
ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    {" "}
    {/* Proporciona el store Redux a toda la aplicación */}
    <PersistGate loading={null} persistor={persistor}>
      {" "}
      {/* Maneja la persistencia del estado */}
      <App /> {/* Componente raíz de la aplicación */}
    </PersistGate>
  </Provider>
);
