// Tests de integración del endpoint de materias (levanta el servidor real en un puerto libre).
import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { crearApp } from "../backend/src/app.js";

let servidor, base, carpeta;

before(async () => {
  carpeta = await mkdtemp(path.join(tmpdir(), "studytrack-"));
  servidor = crearApp({ archivoDatos: path.join(carpeta, "materias.json") });
  await new Promise((ok) => servidor.listen(0, ok));
  base = `http://localhost:${servidor.address().port}/api/materias`;
});

after(async () => {
  await new Promise((ok) => servidor.close(ok));
  await rm(carpeta, { recursive: true, force: true });
});

const post = (body) => fetch(base, { method: "POST", headers: { "Content-Type": "application/json" }, body });

describe("API /api/materias", () => {
  it("GET sin datos devuelve lista vacía", async () => {
    const r = await fetch(base);
    assert.equal(r.status, 200);
    assert.deepEqual(await r.json(), []);
  });

  it("POST válido crea la materia (201) y queda persistida", async () => {
    const r = await post(JSON.stringify({ nombre: "  Física  ", color: "#aa3300" }));
    assert.equal(r.status, 201);
    const creada = await r.json();
    assert.equal(creada.nombre, "Física");
    const lista = await (await fetch(base)).json();
    assert.equal(lista.length, 1);
    assert.equal((await (await fetch(`${base}/${creada.id}`)).json()).nombre, "Física");
  });

  it("POST sin nombre devuelve 400", async () => {
    const r = await post(JSON.stringify({ color: "#aa3300" }));
    assert.equal(r.status, 400);
    assert.deepEqual((await r.json()).errores, ["El nombre es obligatorio"]);
  });

  it("POST con nombre repetido (otra mayúscula) devuelve 400", async () => {
    const r = await post(JSON.stringify({ nombre: "FÍSICA" }));
    assert.equal(r.status, 400);
  });

  it("POST con JSON roto devuelve 400 y no 500", async () => {
    assert.equal((await post("{roto")).status, 400);
  });

  it("caso límite: nombre de exactamente 60 caracteres se acepta, 61 no", async () => {
    assert.equal((await post(JSON.stringify({ nombre: "a".repeat(60) }))).status, 201);
    assert.equal((await post(JSON.stringify({ nombre: "b".repeat(61) }))).status, 400);
  });

  it("GET de una materia inexistente devuelve 404", async () => {
    assert.equal((await fetch(`${base}/no-existe`)).status, 404);
  });
});
