import { ref } from 'vue';

export const useForm = (initialForm: Record<string, any> = {}) => {
  const formState = ref({ ...initialForm });

  const onInputChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const { name, value } = target;
    formState.value = {
      ...formState.value,
      [name]: value,
    };
  };

  const onResetForm = () => {
    formState.value = { ...initialForm };
  };

  return {
    formState,
    onInputChange,
    onResetForm,
  };
};