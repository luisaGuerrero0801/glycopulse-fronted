import { defineStore } from 'pinia';
import GlucometriasProvider from '@/providers/GlucometriasProvider';
import { toast } from 'vue3-toastify';
import type { Glucometria } from '@/types/glucometria';

export const useGlucometriasStore = defineStore('glucometrias', {
    state: () => ({
        glucometrias: [] as Glucometria[],
        loading: false,
        error: ''
    }),

    actions: {
        async verGlucos(){
            this.loading = true;
            this.error = '';

            try{
                const response = await GlucometriasProvider.todasGlucometrias();
                console.log('Datos recibidos:', response.data)
                this.glucometrias = response.data;
            }catch(err: any){
                this.error = 'Error al obtener las glucometrias';
                toast.error(this.error);
                console.error(err);
            } finally {
                this.loading = false;
            }
        },
    },
});