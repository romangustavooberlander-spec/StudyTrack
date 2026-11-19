// StudyTrack - organizador académico personal (frontend).
// React con Hooks, sin build: React y htm se cargan desde CDN.
// Persistencia en localStorage (versión 1, según la SPEC).
import React, { useState, useEffect } from "https://esm.sh/react@18.3.1";
import { createRoot } from "https://esm.sh/react-dom@18.3.1/client";
import htm from "https://esm.sh/htm@3.1.1";
import { obtenerTareasParaMostrar, validarTarea } from "./logica/tareas.js";

const html = htm.bind(React.createElement);
const CLAVE_STORAGE = "studytrack-datos";

function cargarDatos() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE_STORAGE));
    if (guardado && Array.isArray(guardado.materias) && Array.isArray(guardado.tareas)) return guardado;
  } catch (_) { /* datos corruptos o storage bloqueado: empezamos vacíos */ }
  return { materias: [], tareas: [] };
}

function nuevoId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// ---------- Materias ----------
function FormularioMateria({ alGuardar }) {
  const [nombre, setNombre] = useState("");
  const [color, setColor] = useState("#2f6f5e");
  const [profesor, setProfesor] = useState("");
  const [error, setError] = useState("");

  function enviar(e) {
    e.preventDefault();
    if (nombre.trim() === "") return setError("La materia necesita un nombre");
    alGuardar({ id: nuevoId(), nombre: nombre.trim(), color, profesor: profesor.trim(), creadaEl: new Date().toISOString() });
    setNombre(""); setProfesor(""); setError("");
  }

  return html`<form onSubmit=${enviar}>
    <input placeholder="Nombre de la materia" value=${nombre} onInput=${(e) => setNombre(e.target.value)} />
    <input placeholder="Profesor (opcional)" value=${profesor} onInput=${(e) => setProfesor(e.target.value)} />
    <input type="color" value=${color} onInput=${(e) => setColor(e.target.value)} />
    <button>Agregar materia</button>
    ${error && html`<p class="error">${error}</p>`}
  </form>`;
}

function Materia({ materia, alEliminar }) {
  return html`<li>
    <span class="punto" style=${{ background: materia.color }}></span>
    <strong>${materia.nombre}</strong>
    ${materia.profesor && html`<span class="meta">${materia.profesor}</span>`}
    <div class="acciones"><button class="secundario" onClick=${() => alEliminar(materia.id)}>Eliminar</button></div>
  </li>`;
}

function ListaDeMaterias({ materias, alEliminar }) {
  if (materias.length === 0) return html`<p class="meta">Todavía no cargaste materias.</p>`;
  return html`<ul>${materias.map((m) => html`<${Materia} key=${m.id} materia=${m} alEliminar=${alEliminar} />`)}</ul>`;
}

// ---------- Tareas ----------
function FormularioTarea({ materias, alGuardar }) {
  const vacia = { titulo: "", descripcion: "", materiaId: "", fechaLimite: "", tipo: "tarea" };
  const [tarea, setTarea] = useState(vacia);
  const [errores, setErrores] = useState([]);
  const cambiar = (campo) => (e) => setTarea({ ...tarea, [campo]: e.target.value });

  function enviar(e) {
    e.preventDefault();
    const encontrados = validarTarea(tarea);
    if (encontrados.length > 0) return setErrores(encontrados);
    alGuardar({ ...tarea, id: nuevoId(), estado: "pendiente", creadaEl: new Date().toISOString() });
    setTarea(vacia); setErrores([]);
  }

  return html`<form onSubmit=${enviar}>
    <input placeholder="Título" value=${tarea.titulo} onInput=${cambiar("titulo")} />
    <select value=${tarea.materiaId} onChange=${cambiar("materiaId")}>
      <option value="">Materia…</option>
      ${materias.map((m) => html`<option key=${m.id} value=${m.id}>${m.nombre}</option>`)}
    </select>
    <input type="date" value=${tarea.fechaLimite} onInput=${cambiar("fechaLimite")} />
    <select value=${tarea.tipo} onChange=${cambiar("tipo")}>
      <option value="tarea">Tarea</option><option value="examen">Examen</option><option value="entrega">Entrega</option>
    </select>
    <textarea placeholder="Descripción" value=${tarea.descripcion} onInput=${cambiar("descripcion")}></textarea>
    <button>Agregar tarea</button>
    ${errores.map((e) => html`<p class="error" key=${e}>${e}</p>`)}
  </form>`;
}

function Tarea({ tarea, materia, alAlternar, alEliminar }) {
  return html`<li>
    <span class="punto" style=${{ background: materia ? materia.color : "#999" }}></span>
    <span class=${tarea.estado}>${tarea.titulo}</span>
    <span class="meta">${materia ? materia.nombre : "Sin materia"} · ${tarea.tipo} · vence ${tarea.fechaLimite}</span>
    ${tarea.estado === "vencida" && html`<span class="vencida">Vencida</span>`}
    <div class="acciones">
      <button class="secundario" onClick=${() => alAlternar(tarea.id)}>${tarea.estado === "completada" ? "Reabrir" : "Completar"}</button>
      <button class="secundario" onClick=${() => alEliminar(tarea.id)}>Eliminar</button>
    </div>
  </li>`;
}

function ListaDeTareas({ tareas, materias, alAlternar, alEliminar }) {
  const [filtroMateria, setFiltroMateria] = useState("todas");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const visibles = obtenerTareasParaMostrar(tareas, filtroMateria, filtroEstado, new Date());
  const materiaDe = (id) => materias.find((m) => m.id === id);

  return html`<div>
    <form onSubmit=${(e) => e.preventDefault()}>
      <select value=${filtroMateria} onChange=${(e) => setFiltroMateria(e.target.value)}>
        <option value="todas">Todas las materias</option>
        ${materias.map((m) => html`<option key=${m.id} value=${m.id}>${m.nombre}</option>`)}
      </select>
      <select value=${filtroEstado} onChange=${(e) => setFiltroEstado(e.target.value)}>
        <option value="todos">Todos los estados</option><option value="pendiente">Pendientes</option>
        <option value="completada">Completadas</option><option value="vencida">Vencidas</option>
      </select>
    </form>
    ${visibles.length === 0
      ? html`<p class="meta">No hay tareas para mostrar.</p>`
      : html`<ul>${visibles.map((t) => html`<${Tarea} key=${t.id} tarea=${t} materia=${materiaDe(t.materiaId)} alAlternar=${alAlternar} alEliminar=${alEliminar} />`)}</ul>`}
  </div>`;
}

// ---------- Principal ----------
function App() {
  const [datos, setDatos] = useState(cargarDatos);

  useEffect(() => {
    try { localStorage.setItem(CLAVE_STORAGE, JSON.stringify(datos)); } catch (_) { /* storage no disponible */ }
  }, [datos]);

  const agregarMateria = (materia) => setDatos({ ...datos, materias: [...datos.materias, materia] });
  const eliminarMateria = (id) => setDatos({
    materias: datos.materias.filter((m) => m.id !== id),
    tareas: datos.tareas.filter((t) => t.materiaId !== id), // las tareas de esa materia se van con ella
  });
  const agregarTarea = (tarea) => setDatos({ ...datos, tareas: [...datos.tareas, tarea] });
  const alternarTarea = (id) => setDatos({
    ...datos,
    tareas: datos.tareas.map((t) => t.id === id ? { ...t, estado: t.estado === "completada" ? "pendiente" : "completada" } : t),
  });
  const eliminarTarea = (id) => setDatos({ ...datos, tareas: datos.tareas.filter((t) => t.id !== id) });

  return html`<main>
    <h1>StudyTrack</h1>
    <section><h2>Materias</h2>
      <${FormularioMateria} alGuardar=${agregarMateria} />
      <${ListaDeMaterias} materias=${datos.materias} alEliminar=${eliminarMateria} />
    </section>
    <section><h2>Nueva tarea o examen</h2>
      <${FormularioTarea} materias=${datos.materias} alGuardar=${agregarTarea} />
    </section>
    <section><h2>Mis tareas</h2>
      <${ListaDeTareas} tareas=${datos.tareas} materias=${datos.materias} alAlternar=${alternarTarea} alEliminar=${eliminarTarea} />
    </section>
  </main>`;
}

createRoot(document.getElementById("root")).render(html`<${App} />`);
