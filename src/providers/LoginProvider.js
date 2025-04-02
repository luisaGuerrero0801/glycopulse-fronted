import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL +"auth/";

const login = ({correoUsuario,contrasenaUsuario}) => {

    return axios.post(`${BASE_URL}login`,

        {
            "correoUsuario": correoUsuario,
            "contrasenaUsuario": contrasenaUsuario,
        },
        {
            headers: {
                "Accept":"*"            
            }
        });
}

export default {
    login
}