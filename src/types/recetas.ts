export interface receta {
  nombreReceta: string;
  descripcionReceta: string;
  porcionesReceta: number;
  tiempoReceta: string;
  imagenReceta: string;
  nivelReceta: string;
  ingredientesReceta: string;
  preparacionReceta: string;
  categoriaReceta: Categoria[];
}

export interface Categoria {
  id: number;      
  nombreCategoria: string;
  descripcionCategoria: string;
}