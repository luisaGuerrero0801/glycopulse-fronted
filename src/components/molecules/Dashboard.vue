<template>
  <div class="min-h-screen bg-gray-100">
    <div class="flex justify-center items-center flex-col py-8">
      <h1 class="text-4xl font-bold">📊 Dashboard</h1>
      <p class="text-gray-600 mt-2">Resumen de información actual</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 pb-11 text-center p-6">
      <div
        class="bg-white text-blue-600 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <h2 class="text-xl font-bold flex items-center justify-center">👥 suarios en sistema</h2>
        <p class="text-gray-800 text-3xl font-bold">33</p>
        <p class="mt-1 text-sm text-gray-500">Total registrados</p>
      </div>

      <div
        class="bg-white text-blue-600 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <h2 class="text-xl font-bold flex items-center justify-center">🛠️ Administradores</h2>
        <p class="text-gray-800 text-3xl font-bold">3</p>
        <p class="mt-1 text-sm text-gray-500">Total registrados</p>
      </div>

      <div
        class="bg-white text-blue-600 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <h2 class="text-xl font-bold flex items-center justify-center">🤱🏻 Pacientes</h2>
        <p class="text-gray-800 text-3xl font-bold">3</p>
        <p class="mt-1 text-sm text-gray-500">Total registrados</p>
      </div>

      <div
        class="bg-white text-blue-600 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <h2 class="text-xl font-bold flex items-center justify-center">🩸A+</h2>
        <p class="text-gray-800 text-3xl font-bold">3</p>
        <p class="mt-1 text-sm text-gray-500">Total registrados</p>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
        <!-- Grupo A+ -->
        <div
          class="bg-white text-blue-600 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-4"
        >
          <h2 class="text-xl font-bold flex items-center justify-center">🩸 A+</h2>
          <p class="text-gray-800 text-3xl font-bold">0</p>
          <p class="mt-1 text-sm text-gray-500">Total registrados</p>
        </div>

        <!-- Grupo A- -->
        <div
          class="bg-white text-blue-600 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-4"
        >
          <h2 class="text-xl font-bold flex items-center justify-center">🩸 A-</h2>
          <p class="text-gray-800 text-3xl font-bold">0</p>
          <p class="mt-1 text-sm text-gray-500">Total registrados</p>
        </div>

        <!-- Grupo B+ -->
        <div
          class="bg-white text-blue-600 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-4"
        >
          <h2 class="text-xl font-bold flex items-center justify-center">🩸 B+</h2>
          <p class="text-gray-800 text-3xl font-bold">0</p>
          <p class="mt-1 text-sm text-gray-500">Total registrados</p>
        </div>

        <!-- Grupo B- -->
        <div
          class="bg-white text-blue-600 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-4"
        >
          <h2 class="text-xl font-bold flex items-center justify-center">🩸 B-</h2>
          <p class="text-gray-800 text-3xl font-bold">3</p>
          <p class="mt-1 text-sm text-gray-500">Total registrados</p>
        </div>

        <!-- Grupo AB+ -->
        <div
          class="bg-white text-blue-600 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-4"
        >
          <h2 class="text-xl font-bold flex items-center justify-center">🩸 AB+</h2>
          <p class="text-gray-800 text-3xl font-bold">0</p>
          <p class="mt-1 text-sm text-gray-500">Total registrados</p>
        </div>

        <!-- Grupo AB- -->
        <div
          class="bg-white text-blue-600 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-4"
        >
          <h2 class="text-xl font-bold flex items-center justify-center">🩸 AB-</h2>
          <p class="text-gray-800 text-3xl font-bold">0</p>
          <p class="mt-1 text-sm text-gray-500">Total registrados</p>
        </div>

        <!-- Grupo O+ -->
        <div
          class="bg-white text-blue-600 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-4"
        >
          <h2 class="text-xl font-bold flex items-center justify-center">🩸 O+</h2>
          <p class="text-gray-800 text-3xl font-bold">0</p>
          <p class="mt-1 text-sm text-gray-500">Total registrados</p>
        </div>

        <!-- Grupo O- -->
        <div
          class="bg-white text-blue-600 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-4"
        >
          <h2 class="text-xl font-bold flex items-center justify-center">🩸 O-</h2>
          <p class="text-gray-800 text-3xl font-bold">0</p>
          <p class="mt-1 text-sm text-gray-500">Total registrados</p>
        </div>
      </div>
    </div>
  </div>
</template>
