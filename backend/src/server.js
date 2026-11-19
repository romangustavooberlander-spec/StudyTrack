// Punto de entrada del backend de StudyTrack.
import path from "node:path";
import { fileURLToPath } from "node:url";
import { crearApp } from "./app.js";

const carpeta = path.dirname(fileURLToPath(import.meta.url));
const PUERTO = Number(process.env.PORT) || 3001;
const archivoDatos = process.env.DATA_FILE || path.join(carpeta, "data", "materias.json");

crearApp({ archivoDatos }).listen(PUERTO, () => {
  console.log(`StudyTrack API escuchando en http://localhost:${PUERTO}`);
});
