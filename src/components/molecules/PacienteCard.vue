<template>
  <tr>
    <td class="p-4">{{ paciente.nombre }}</td>
    <td class="p-4">{{ calcularEdad(paciente.fechaNacimiento) }}</td>
    <td class="p-4">{{ paciente.email }}</td>
    <td class="p-4">{{ paciente.telefono }}</td>
    <td class="p-4">{{ paciente.rh }}</td>
  </tr>
</template>

<script setup lang="ts">
defineProps<{
  paciente: any
}>()

const calcularEdad = (fechaNacimiento: string): number => {
  const nacimiento = new Date(fechaNacimiento)
  const hoy = new Date()
  let edad = hoy.getFullYear() - nacimiento.getFullYear()
  const mes = hoy.getMonth() - nacimiento.getMonth()
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--
  }
  return edad
}
</script>
