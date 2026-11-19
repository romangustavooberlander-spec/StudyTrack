// Controller: traduce HTTP <-> Service. Lee el request, llama al service y arma la respuesta.
import { ErrorDeValidacion } from "../services/materiasService.js";

const LIMITE_BODY_BYTES = 10 * 1024;

function responder(res, status, cuerpo) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(cuerpo));
}

function leerJson(req) {
  return new Promise((resolve, reject) => {
    let cuerpo = "";
    req.on("data", (parte) => {
      cuerpo += parte;
      if (cuerpo.length > LIMITE_BODY_BYTES) {
        reject(new ErrorDeValidacion(["El cuerpo del pedido es demasiado grande"]));
        req.destroy();
      }
    });
    req.on("end", () => {
      try { resolve(cuerpo ? JSON.parse(cuerpo) : {}); }
      catch { reject(new ErrorDeValidacion(["El cuerpo no es JSON válido"])); }
    });
    req.on("error", reject);
  });
}

export function crearMateriasController(service) {
  return {
    async listar(req, res) {
      responder(res, 200, await service.listar());
    },

    async obtener(req, res, id) {
      const materia = await service.obtener(id);
      if (!materia) return responder(res, 404, { error: "Materia no encontrada" });
      responder(res, 200, materia);
    },

    async crear(req, res) {
      try {
        const materia = await service.crear(await leerJson(req));
        responder(res, 201, materia);
      } catch (error) {
        if (error instanceof ErrorDeValidacion) return responder(res, 400, { errores: error.errores });
        throw error;
      }
    },
  };
}

export { responder };
