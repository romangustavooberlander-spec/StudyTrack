// StudyTrack - lógica de tareas (versión DESPUÉS del refactoring)
// Mismo comportamiento que antes: se separaron responsabilidades en funciones chicas.

const TIPOS_VALIDOS = ["tarea", "examen", "entrega"];

// Convierte "AAAA-MM-DD" al último segundo de ese día (una tarea vence al terminar el día).
function finDelDia(fechaLimite) {
  return new Date(fechaLimite + "T23:59:59");
}

// Estado real de una tarea según la fecha actual.
export function calcularEstado(tarea, hoy) {
  if (tarea.estado === "completada") return "completada";
  return finDelDia(tarea.fechaLimite) < hoy ? "vencida" : "pendiente";
}

// Un filtro está activo si tiene un valor distinto del "mostrar todo".
function filtroActivo(valor, valorTodos) {
  return valor !== valorTodos && valor !== "" && valor !== null && valor !== undefined;
}

function compararPorFechaLimite(a, b) {
  return finDelDia(a.fechaLimite) - finDelDia(b.fechaLimite);
}

export function obtenerTareasParaMostrar(tareas, filtroMateria, filtroEstado, hoy) {
  return tareas
    .map((tarea) => ({ ...tarea, estado: calcularEstado(tarea, hoy) }))
    .filter((tarea) => !filtroActivo(filtroMateria, "todas") || tarea.materiaId === filtroMateria)
    .filter((tarea) => !filtroActivo(filtroEstado, "todos") || tarea.estado === filtroEstado)
    .sort(compararPorFechaLimite);
}

export function validarTarea(tarea) {
  const errores = [];
  if (!tarea.titulo || tarea.titulo.trim() === "") errores.push("El título es obligatorio");
  if (!tarea.materiaId) errores.push("La tarea debe tener una materia asociada");
  if (!tarea.fechaLimite) errores.push("La fecha límite es obligatoria");
  if (!TIPOS_VALIDOS.includes(tarea.tipo)) errores.push("Tipo inválido");
  return errores;
}
