import { ref, computed, watch } from 'vue'
import { useUsuariosStore } from '@/stores/donantes'
import { storeToRefs } from 'pinia'

export function useUsuariosPagination(
  itemsPerPage = 5,
  externalItems?: any[] 
) {
  const usuariosStore = useUsuariosStore()
  const { usuariosFiltrados, loading, error } = storeToRefs(usuariosStore)

  // Usa `ref` para la página actual
  const currentPage = ref(1)

  // Si `externalItems` está disponible, usa ese valor; si no, usa `usuariosFiltrados`
  const sourceItems = ref(externalItems ?? usuariosFiltrados.value)

  // Si se pasan `externalItems`, se actualizarán de forma reactiva
  if (externalItems) {
    watch(
      () => externalItems,
      (newItems) => {
        sourceItems.value = newItems ?? []  // Asignamos los nuevos elementos a `sourceItems`
        currentPage.value = 1  // Restablecemos la página a 1
      },
      { immediate: true }  // Inicia el `watcher` inmediatamente
    )
  } else {
    // Si no se pasan `externalItems`, se observará `usuariosFiltrados` del store
    watch(
      usuariosFiltrados,
      (newItems) => {
        sourceItems.value = newItems ?? []  // Actualizamos `sourceItems` con los nuevos elementos
        currentPage.value = 1  // También reiniciamos la página
      },
      { immediate: true }  // También iniciamos el `watcher` de inmediato
    )
  }

  // Computada para la lista de usuarios paginada
  const paginatedUsuarios = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    return sourceItems.value.slice(start, start + itemsPerPage)  // Paginamos los usuarios
  })

  // Computada para el número total de páginas
  const totalPages = computed(() => {
    return Math.max(Math.ceil(sourceItems.value.length / itemsPerPage), 1)  // Calculamos las páginas
  })

  // Función para ir a una página específica
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page  // Actualizamos la página actual
    }
  }

  return {
    currentPage,
    itemsPerPage,
    usuariosFiltrados,
    paginatedUsuarios,
    totalPages,
    loading,
    error,
    goToPage,
    fetchUsuarios: usuariosStore.fetchUsuarios,  // Exponemos la función para obtener usuarios
  }
}
