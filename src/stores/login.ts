import { defineStore } from "pinia";
import Login from '@/Providers/LoginProvider';
import { toast } from 'vue3-toastify';

export type State = {
    correoUsuario: string,
    contrasenaUsuario: string
}

export const loginStore = defineStore('login', {
    actions: {
        validateUser(correoUsuario: string, contrasenaUsuario: string){
            return new Promise( r => {
                let request;
                request = Login.login({
                    correoUsuario: correoUsuario,
                    contrasenaUsuario: contrasenaUsuario
                })

                request.then(res =>{
                    toast('Login Correcto', {type: toast.TYPE.SUCCESS})
                }).catch(e =>{
                    toast('Login Incorrecto', {type: toast.TYPE.ERROR})
                })
            })
        }
    }
})