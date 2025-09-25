import router from "@/router";
import { defineStore } from "pinia";
const { VITE_API_URL } = import.meta.env

export const useRecetasStore = defineStore('recetas', {
  state: () => ({
    favoritos: [] as any[],
    loading: false,
    error: null as string | null
  }),
  actions: {
    async fetchRecetas() {
      this.loading = true;
      this.error = null;
      
      try {
       
        const token = sessionStorage.getItem('token');
        
        if (!token) {
          throw new Error('No hay token de autenticación');
        }

        
        const response = await fetch(`${VITE_API_URL}/recetas`, {
          headers: {
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json'
          }
        });

       
        if (response.status === 401) {
          throw new Error('Token inválido o expirado');
        }

        if (!response.ok) {
          throw new Error('Error al obtener recetas');
        }
        
        const data = await response.json();
        this.favoritos = data;
        
      } catch (error: any) {
        this.error = error.message;
        console.error("Error en fetchRecetas:", {
          message: error.message,
          stack: error.stack
        });
        
     
        if (error.message.includes('401') || error.message.includes('inválido')) {
          const loginStore = useLoginStore();
          loginStore.logout();
          router.push('/');
        }
      } finally {
        this.loading = false;
      }
    }
  }
});