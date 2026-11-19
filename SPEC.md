# SPEC — StudyTrack

**Objetivo:** aplicación web para que un estudiante organice sus materias y las tareas/exámenes asociados, con seguimiento de fechas límite.

**Usuario:** estudiantes que cursan varias materias a la vez.

**Funcionalidades**
- Materias: crear, editar, eliminar (nombre, color, profesor opcional).
- Tareas: crear, editar, eliminar, marcar como completada (título, descripción, materia, fecha límite, tipo: tarea/examen/entrega).
- Estado calculado: pendiente, completada o vencida (vencida = no completada y pasó el día de su fecha límite).
- Filtros por materia y por estado. Vista general ordenada por fecha límite, resaltando vencidas.

**Datos**
- Materia: id, nombre, color, profesor, creadaEl.
- Tarea: id, titulo, descripcion, materiaId, fechaLimite (AAAA-MM-DD), tipo, estado, creadaEl.

**Restricciones (v1)**: sin login; frontend persiste en localStorage; usable desde el celular.

**Módulo 3**: se agrega un backend (Node.js) para mover persistencia y validaciones importantes al servidor.
