// src/helpers/mapPasos.ts
export function mapPasosFrontToBack(pasos: string[]) {
  return pasos.map((p, idx) => ({
    ordenPasoReceta: idx + 1,
    descripcionPasoReceta: p,
  }))
}
