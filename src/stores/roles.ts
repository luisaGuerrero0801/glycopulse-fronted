// stores/roles.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

interface Rol {
  idRol: number
  nombreRol: string
}

export const useRolesStore = defineStore('roles', () => {
  const roles = ref<Rol[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchRoles = async () => {
    loading.value = true
    try {
      const response = await axios.get('https://glycopulse-back-production.up.railway.app/roles')
      roles.value = response.data
    } catch (err) {
      error.value = 'Error al cargar los roles.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  return {
    roles,
    loading,
    error,
    fetchRoles
  }
})
