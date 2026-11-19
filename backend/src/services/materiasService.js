// Service: reglas de negocio de las materias. No sabe nada de HTTP ni de archivos.
import { randomUUID } from "node:crypto";

export class ErrorDeValidacion extends Error {
  constructor(errores) {
    super("Datos inválidos");
    this.errores = errores;
  }
}

const COLOR_HEX = /^#[0-9a-fA-F]{6}$/;
const LARGO_MAXIMO_NOMBRE = 60;

export function crearMateriasService(repository) {
  return {
    listar: () => repository.listar(),

    obtener: (id) => repository.buscarPorId(id),

    async crear(datos) {
      const nombre = typeof datos?.nombre === "string" ? datos.nombre.trim() : "";
      const color = datos?.color ?? "#2f6f5e";
      const profesor = typeof datos?.profesor === "string" ? datos.profesor.trim() : "";

      const errores = [];
      if (nombre === "") errores.push("El nombre es obligatorio");
      if (nombre.length > LARGO_MAXIMO_NOMBRE) errores.push(`El nombre no puede superar ${LARGO_MAXIMO_NOMBRE} caracteres`);
      if (!COLOR_HEX.test(color)) errores.push("El color debe tener formato #RRGGBB");
      if (errores.length === 0 && (await repository.buscarPorNombre(nombre))) errores.push("Ya existe una materia con ese nombre");
      if (errores.length > 0) throw new ErrorDeValidacion(errores);

      return repository.crear({ id: randomUUID(), nombre, color, profesor, creadaEl: new Date().toISOString() });
    },
  };
}
