import mongoose from "mongoose";

// Define el esquema de Mongoose para el modelo Listing
const listingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    course: {
      type: String,
      required: true,
    },
    semester: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    imageUrls: {
      type: Array,
      required: true,
    },
    userRef: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // Opciones adicionales del esquema, en este caso para registrar timestamps
);

// Crea el modelo Listing basado en el esquema listingSchema
const Listing = mongoose.model("Listing", listingSchema);

// Exporta el modelo Listing para que pueda ser utilizado en otros archivos
export default Listing;
