// StudyTrack - lógica de tareas (versión ANTES del refactoring)
// Esta función se usa en ListaDeTareas para mostrar las tareas filtradas y ordenadas.

export function obtenerTareasParaMostrar(tareas, filtroMateria, filtroEstado, hoy) {
  const resultado = [];
  for (let i = 0; i < tareas.length; i++) {
    const t = tareas[i];
    // calcular el estado real de la tarea
    let est = t.estado;
    if (t.estado !== "completada") {
      const f = new Date(t.fechaLimite + "T23:59:59");
      if (f < hoy) {
        est = "vencida";
      } else {
        est = "pendiente";
      }
    }
    // filtro por materia
    if (filtroMateria !== "todas" && filtroMateria !== "" && filtroMateria !== null && filtroMateria !== undefined) {
      if (t.materiaId !== filtroMateria) {
        continue;
      }
    }
    // filtro por estado
    if (filtroEstado !== "todos" && filtroEstado !== "" && filtroEstado !== null && filtroEstado !== undefined) {
      if (est !== filtroEstado) {
        continue;
      }
    }
    resultado.push({ ...t, estado: est });
  }
  // ordenar por fecha limite
  resultado.sort((a, b) => {
    const fa = new Date(a.fechaLimite + "T23:59:59");
    const fb = new Date(b.fechaLimite + "T23:59:59");
    return fa - fb;
  });
  return resultado;
}

export function validarTarea(tarea) {
  const errores = [];
  if (!tarea.titulo || tarea.titulo.trim() === "") errores.push("El título es obligatorio");
  if (!tarea.materiaId) errores.push("La tarea debe tener una materia asociada");
  if (!tarea.fechaLimite) errores.push("La fecha límite es obligatoria");
  if (!["tarea", "examen", "entrega"].includes(tarea.tipo)) errores.push("Tipo inválido");
  return errores;
}
