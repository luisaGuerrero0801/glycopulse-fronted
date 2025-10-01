// VistaHomeRecetas.ts
import { defineStore } from 'pinia'
import axios from 'axios'

interface Ingrediente {
  nombre: string
  cantidad: number | null
  unidad: string
}

interface Paso {
  numero: number
  descripcion: string
}

interface Receta {
  idReceta: number
  nombre: string
  descripcion: string
  nivel: string
  porciones: number
  calorias: number
  tiempo: string
  imagenReceta?: string
  ingredientes?: Ingrediente[]
  pasosPreparacion?: Paso[]
  esFavorito?: boolean // 👈 agregado
}

export const useRecetasPacienteStore = defineStore('recetasPaciente', {
  state: () => ({
    recetas: [] as Receta[],
    cargando: false,
    error: '' as string | null,
    usuarioId: 0 // 👈 guardamos el id del usuario
  }),
  actions: {
    async fetchRecetasPaciente(idUsuario: number) {
      this.cargando = true
      this.error = null
      this.usuarioId = idUsuario // guardamos el usuario activo
      try {
        const token = sessionStorage.getItem('token')
        if (!token) throw new Error('Token no encontrado en sessionStorage')

        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}recetas/usuario/${idUsuario}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        const claveFavoritos = `favoritos_${idUsuario}`
        const favoritosGuardados = JSON.parse(localStorage.getItem(claveFavoritos) || '[]')
        // 🔹 Mapear datos del backend → frontend
        this.recetas = Array.isArray(data)
          ? data.map((r: any) => ({
              idReceta: r.idReceta,
              nombre: r.nombreReceta,
              descripcion: r.descripcionReceta,
              nivel: r.nivelReceta,
              porciones: r.porcionesReceta,
              calorias: r.caloriasReceta,
              tiempo: r.tiempoReceta,
              imagenReceta: r.imagenReceta,
              ingredientes: r.ingredientes.map((i: any) => ({
                nombre: i.ingrediente.nombreIngrediente,
                cantidad: i.cantidadIngredienteReceta,
                unidad: i.medidaIngredienteReceta
              })),
              pasosPreparacion: r.pasos
                .sort((a: any, b: any) => a.ordenPasoReceta - b.ordenPasoReceta)
                .map((p: any) => ({
                  descripcion: p.descripcionPasoReceta
                })),
              // Marcamos como favorito si ya estaba guardado
              esFavorito: favoritosGuardados.includes(r.idReceta)
            }))
          : []
      } catch (err: any) {
        this.error = err.response?.data?.message || err.message || 'Error al cargar recetas'
      } finally {
        this.cargando = false
      }
    },
toggleFavoritoReceta(receta: Receta) {
  // Alternar favorito en memoria
  receta.esFavorito = !receta.esFavorito

  // Guardar en localStorage con clave por usuario
  const claveFavoritos = `favoritos_${this.usuarioId}`
  const favoritosGuardados = JSON.parse(localStorage.getItem(claveFavoritos) || '[]')

  if (receta.esFavorito) {
    if (!favoritosGuardados.includes(receta.idReceta)) {
      favoritosGuardados.push(receta.idReceta)
    }
  } else {
    const index = favoritosGuardados.indexOf(receta.idReceta)
    if (index > -1) favoritosGuardados.splice(index, 1)
  }

  localStorage.setItem(claveFavoritos, JSON.stringify(favoritosGuardados))
}
  }
})
