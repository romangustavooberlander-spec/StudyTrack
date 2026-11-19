// Controller para descargar un backup de los datos (borrador).
// Uso: GET /api/exportar?archivo=materias.json
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const CARPETA_DATOS = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "data");

export async function exportar(req, res) {
  const url = new URL(req.url, "http://localhost");
  const archivo = url.searchParams.get("archivo") || "materias.json";
  try {
    const contenido = await readFile(path.join(CARPETA_DATOS, archivo), "utf8");
    res.writeHead(200, {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="${archivo}"`,
    });
    res.end(contenido);
  } catch {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Archivo no encontrado" }));
  }
}
