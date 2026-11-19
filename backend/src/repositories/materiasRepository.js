// Repository: único lugar que sabe CÓMO se guardan las materias.
// Hoy es un archivo JSON; si mañana pasamos a una base de datos, solo cambia este archivo.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

export function crearMateriasRepository(rutaArchivo) {
  async function leerTodas() {
    try {
      return JSON.parse(await readFile(rutaArchivo, "utf8"));
    } catch (error) {
      if (error.code === "ENOENT") return []; // todavía no hay datos guardados
      throw error;
    }
  }

  async function guardarTodas(materias) {
    await mkdir(path.dirname(rutaArchivo), { recursive: true });
    await writeFile(rutaArchivo, JSON.stringify(materias, null, 2));
  }

  return {
    listar: leerTodas,
    async buscarPorId(id) {
      return (await leerTodas()).find((m) => m.id === id) ?? null;
    },
    async buscarPorNombre(nombre) {
      const buscado = nombre.toLowerCase();
      return (await leerTodas()).find((m) => m.nombre.toLowerCase() === buscado) ?? null;
    },
    async crear(materia) {
      const materias = await leerTodas();
      materias.push(materia);
      await guardarTodas(materias);
      return materia;
    },
  };
}
