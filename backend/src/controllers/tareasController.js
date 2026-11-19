// Controller de tareas (borrador de la próxima funcionalidad).
import { randomUUID } from "node:crypto";

export function crearTareasController(repository) {
  return {
    listar(req, res) {
      const url = new URL(req.url, "http://localhost");
      const materiaId = url.searchParams.get("materiaId");
      let tareas = repository.listar();
      if (materiaId) tareas = tareas.filter((t) => t.materiaId === materiaId);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(tareas));
    },

    crear(req, res) {
      let cuerpo = "";
      req.on("data", (parte) => (cuerpo += parte));
      req.on("end", () => {
        const datos = JSON.parse(cuerpo);
        const tarea = {
          ...datos,
          id: randomUUID(),
          estado: "pendiente",
          creadaEl: new Date().toISOString(),
        };
        repository.crear(tarea);
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify(tarea));
      });
    },
  };
}
