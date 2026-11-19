// Arma la aplicación: conecta Repository -> Service -> Controller y define las rutas.
import http from "node:http";
import { crearMateriasRepository } from "./repositories/materiasRepository.js";
import { crearMateriasService } from "./services/materiasService.js";
import { crearMateriasController, responder } from "./controllers/materiasController.js";

export function crearApp({ archivoDatos }) {
  const controller = crearMateriasController(crearMateriasService(crearMateriasRepository(archivoDatos)));

  return http.createServer(async (req, res) => {
    const url = new URL(req.url, "http://localhost");
    const partes = url.pathname.split("/").filter(Boolean); // ["api", "materias", ":id"]

    try {
      if (partes[0] === "api" && partes[1] === "materias") {
        if (partes.length === 2 && req.method === "GET") return await controller.listar(req, res);
        if (partes.length === 2 && req.method === "POST") return await controller.crear(req, res);
        if (partes.length === 3 && req.method === "GET") return await controller.obtener(req, res, partes[2]);
      }
      responder(res, 404, { error: "Ruta no encontrada" });
    } catch (error) {
      console.error(error);
      responder(res, 500, { error: "Error interno del servidor" });
    }
  });
}
