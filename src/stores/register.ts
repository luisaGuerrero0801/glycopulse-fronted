import { defineStore } from 'pinia'
import axios from 'axios'
const { VITE_API_URL } = import.meta.env
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

export const useRegisterStore = defineStore('register', {
  actions: {
    async registerUser(userData: any) {
      try {
        // const response = await axios.post('http://localhost:3000/api/v1/usuarios/', userData, {
        const response = await axios.post(`${VITE_API_URL}usuarios/`, userData, {
          headers: { 'Content-Type': 'application/json' }
        })
        
        toast.success('Usuario registrado correctamente 🎉', {
          autoClose: 3000,
          position: 'top-right'
        })

        return response.data
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data?.message ||
                               error.response?.data?.error ||
                               'Error al registrar usuario'
          throw new Error(errorMessage)
        }
        throw error
      }
    }
  }
})
