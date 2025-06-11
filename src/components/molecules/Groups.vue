<template>
  <div class="p-6 max-w-4xl mx-auto space-y-6">

    <div class="flex justify-center items-center flex-col py-8 bg-white rounded-t-xl shadow-sm">
      <h1 class="text-4xl font-bold text-gray-800">👥 Gestión de Grupos</h1>
      <p class="text-gray-600 mt-2">Administra los grupos del sistema</p>
    </div>

    <div class="flex items-center justify-between">
      <input
        type="text"
        placeholder="Buscar grupos"
        class="border border-gray-300 rounded-lg px-4 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <ul class="flex space-x-4">
        <li>
          <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">Organizar</button>
        </li>
        <li>
          <button class="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition">Limpiar selección</button>
        </li>
      </ul>
    </div>

    <div class="bg-gray-100 rounded-lg p-4">
      <ul class="grid grid-cols-3 font-semibold text-gray-700">
        <li>Nombre Grupo</li>
        <li>Miembros</li>
        <li>Creado</li>
      </ul>
    </div>

    <div class="bg-white rounded-lg shadow divide-y divide-gray-200">
      <div class="grid grid-cols-3 items-center p-4">
        <div class="flex items-center space-x-4">
          <img
            src="/profile/avatar.png"
            alt="Imagen del grupo"
            class="w-12 h-12 rounded-full object-cover"
          />
          <h2 class="text-lg font-bold">Test Grupo</h2>
        </div>
        <p class="text-gray-600">5 Miembros</p>
        <p class="text-gray-500">2024-06-10</p>
      </div>

      <div class="grid grid-cols-3 items-center p-4">
        <div class="flex items-center space-x-4">
          <img
            src="/profile/avatar.png"
            alt="Imagen del grupo"
            class="w-12 h-12 rounded-full object-cover"
          />
          <h2 class="text-lg font-bold">Prueba</h2>
        </div>
        <p class="text-gray-600">8 Miembros</p>
        <p class="text-gray-500">2024-05-20</p>
      </div>
    </div>

  </div>
</template>
