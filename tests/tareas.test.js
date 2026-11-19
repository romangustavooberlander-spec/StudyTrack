// Tests unitarios de obtenerTareasParaMostrar y validarTarea.
// Se ejecutan contra la versión ANTES y la versión DESPUÉS del refactoring
// para comprobar que el comportamiento no cambió.
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as antes from "../antes/tareas.js";
import * as despues from "../frontend/logica/tareas.js";

const HOY = new Date("2026-10-25T12:00:00");

const tareas = [
  { id: 1, titulo: "TP Física", materiaId: "fis", fechaLimite: "2026-11-02", tipo: "entrega", estado: "pendiente" },
  { id: 2, titulo: "Parcial Mate", materiaId: "mat", fechaLimite: "2026-10-20", tipo: "examen", estado: "pendiente" },
  { id: 3, titulo: "Resumen Historia", materiaId: "his", fechaLimite: "2026-10-10", tipo: "tarea", estado: "completada" },
  { id: 4, titulo: "Ejercicios Mate", materiaId: "mat", fechaLimite: "2026-10-28", tipo: "tarea", estado: "pendiente" },
];

for (const [nombre, modulo] of [["ANTES", antes], ["DESPUÉS", despues]]) {
  const { obtenerTareasParaMostrar, validarTarea } = modulo;

  describe(`[${nombre}] obtenerTareasParaMostrar`, () => {
    it("caso correcto: sin filtros devuelve todas ordenadas por fecha límite", () => {
      const r = obtenerTareasParaMostrar(tareas, "todas", "todos", HOY);
      assert.deepEqual(r.map((t) => t.id), [3, 2, 4, 1]);
    });

    it("caso correcto: marca como vencida una pendiente con fecha pasada", () => {
      const r = obtenerTareasParaMostrar(tareas, "todas", "todos", HOY);
      assert.equal(r.find((t) => t.id === 2).estado, "vencida");
    });

    it("caso correcto: una completada sigue completada aunque su fecha haya pasado", () => {
      const r = obtenerTareasParaMostrar(tareas, "todas", "todos", HOY);
      assert.equal(r.find((t) => t.id === 3).estado, "completada");
    });

    it("caso correcto: combina filtro por materia y por estado", () => {
      const r = obtenerTareasParaMostrar(tareas, "mat", "pendiente", HOY);
      assert.deepEqual(r.map((t) => t.id), [4]);
    });

    it("caso inválido: filtros vacíos/null/undefined se comportan como 'todas'/'todos'", () => {
      for (const vacio of ["", null, undefined]) {
        const r = obtenerTareasParaMostrar(tareas, vacio, vacio, HOY);
        assert.equal(r.length, 4);
      }
    });

    it("caso inválido: materia inexistente devuelve lista vacía", () => {
      assert.deepEqual(obtenerTareasParaMostrar(tareas, "quimica", "todos", HOY), []);
    });

    it("caso límite: lista de tareas vacía", () => {
      assert.deepEqual(obtenerTareasParaMostrar([], "todas", "todos", HOY), []);
    });

    it("caso límite: tarea que vence hoy todavía está pendiente", () => {
      const r = obtenerTareasParaMostrar(
        [{ id: 9, titulo: "Hoy", materiaId: "mat", fechaLimite: "2026-10-25", tipo: "tarea", estado: "pendiente" }],
        "todas", "todos", HOY
      );
      assert.equal(r[0].estado, "pendiente");
    });

    it("caso límite: no modifica el array original", () => {
      const copia = structuredClone(tareas);
      obtenerTareasParaMostrar(tareas, "todas", "todos", HOY);
      assert.deepEqual(tareas, copia);
    });
  });

  describe(`[${nombre}] validarTarea`, () => {
    it("caso correcto: tarea completa no tiene errores", () => {
      assert.deepEqual(validarTarea(tareas[0]), []);
    });
    it("caso inválido: sin materia ni fecha devuelve ambos errores", () => {
      const e = validarTarea({ titulo: "X", tipo: "tarea" });
      assert.ok(e.includes("La tarea debe tener una materia asociada"));
      assert.ok(e.includes("La fecha límite es obligatoria"));
    });
    it("caso límite: título con solo espacios es inválido", () => {
      assert.ok(validarTarea({ ...tareas[0], titulo: "   " }).includes("El título es obligatorio"));
    });
  });
}
