// Repository de tareas (borrador de la próxima funcionalidad).
import fs from "node:fs";

export function crearTareasRepository(rutaArchivo) {
  function leerTodas() {
    return JSON.parse(fs.readFileSync(rutaArchivo, "utf8"));
  }

  return {
    listar() {
      return leerTodas();
    },

    crear(tarea) {
      const tareas = leerTodas();
      tareas.push(tarea);
      fs.writeFile(rutaArchivo, JSON.stringify(tareas), () => {});
      return tarea;
    },

    eliminarPorMateria(materiaId) {
      const tareas = leerTodas().filter((t) => t.materiaId !== materiaId);
      fs.writeFile(rutaArchivo, JSON.stringify(tareas), () => {});
    },
  };
}
