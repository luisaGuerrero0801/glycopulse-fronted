// en helpers/mapIngredientes.ts
import type { Ingrediente } from '@/types/crearRecetas'

export function mapIngredientesFrontToBack(ingredientes: Ingrediente[]) {
  return ingredientes.map((i) => ({
    nombreIngrediente: i.nombre,
    cantidadIngredienteReceta: i.cantidad,
    medidaIngredienteReceta: i.unidad,
  }))
}
