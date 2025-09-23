import instance from '@/providers/axiosInstance';

const login = ({ correoUsuario, contrasenaUsuario }) => {
  return instance.post('auth/login', { correoUsuario, contrasenaUsuario });
};

export default { login };
