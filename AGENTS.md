# AGENTS.md

## Project
StudyTrack: organizador académico para estudiantes. Permite cargar materias (nombre, color, profesor)
y tareas/exámenes/entregas asociados a cada materia, con fecha límite, filtros por materia y estado,
y una vista ordenada por vencimiento que resalta lo vencido.

- `frontend/`: React con Hooks (sin build, React desde CDN). Persistencia en localStorage.
- `frontend/logica/`: funciones puras (estado, filtros, validaciones). Acá va la lógica testeable.
- `backend/src/`: API en Node.js con arquitectura Controller → Service → Repository.
- `tests/`: tests con el runner nativo de Node (`node:test`).
- La SPEC del proyecto está en `SPEC.md`. Leela antes de proponer cambios.

## Commands
- `npm test` — corre todos los tests. Tienen que pasar antes de dar algo por terminado.
- `npm start` — levanta la API en http://localhost:3001
- Frontend: servir la carpeta `frontend/` con cualquier servidor estático (ej. `npx serve frontend`).

## Code style
- Nombres de variables y funciones en español y descriptivos (`calcularEstado`, no `calc`).
- Componentes React: PascalCase. Variables y funciones: camelCase. Constantes: MAYUSCULAS_CON_GUION.
- Componentes y funciones chicas, con una sola responsabilidad.
- La lógica de negocio va en funciones puras (`frontend/logica/` o en los Services), no dentro de los componentes ni de los Controllers.
- Sin dependencias nuevas: el proyecto usa solo módulos nativos de Node y React por CDN.
- Comentarios para explicar el *por qué*, no el *qué*.

## Agent behavior
Puede hacer sin pedir permiso:
- Leer cualquier archivo del proyecto.
- Proponer cambios explicando qué cambia y por qué.
- Escribir o modificar tests.
- Correr `npm test` y `npm start`.
- Hacer cambios chicos dentro de la funcionalidad que se le pidió.

## Ask before
NO debe hacer sin permiso:
- Instalar dependencias o agregar librerías.
- Cambiar la arquitectura (Controller / Service / Repository) o mover carpetas.
- Cambiar el formato de los datos guardados (localStorage o `backend/src/data/`), porque rompe los datos existentes.
- Borrar archivos o tests.
- Tocar funcionalidades distintas de la que se le pidió.
- Hacer commits, push o deploy.
- Modificar este AGENTS.md o la SPEC.

## Definition of done
- `npm test` pasa completo.
- Lo nuevo tiene al menos un test de caso correcto, uno de datos inválidos y uno límite.
- Se explica en pocas líneas qué se cambió.
