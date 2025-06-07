<template>
  <section>
    <div>
      <div class="flex justify-center items-center flex-col">
        <h1 class="text-4xl font-bold">👋 ¡Hola, Admin!</h1>
        <p class="text-3xl font-semibold text-gray-400 ">Elige una opción para gestionar el sistema:</p>
      </div>
      <div class="flex min-h-screen items-center justify-center px-6 py-11 bg-gray-100">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <router-link to="users">
            <div
              class="bg-white text-blue-600 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <h2 class="text-xl font-bold flex items-center">
                <span class="material-icons mr-3">group</span> Usuarios
              </h2>
              <p class="mt-2 text-sm">Gestiona todos los usuarios registrados.</p>
            </div>
          </router-link>

          <router-link to="/notificaciones">
            <div
              class="bg-white text-blue-600 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <h2 class="text-xl font-bold flex items-center">
                <span class="material-icons mr-3">notifications</span> Notificaciones
              </h2>
              <p class="mt-2 text-sm">
                Tienes
                <span class="font-bold text-red-600">{{ 0}}</span> nuevas
                notificaciones.
              </p>
            </div>
          </router-link>

          <router-link to="/dashboard">
            <div
              class="bg-white text-blue-600 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <h2 class="text-xl font-bold flex items-center">
                <span class="material-icons mr-3">dashboard</span> Dashboard
              </h2>
              <p class="mt-2 text-sm">Visión general de las estadísticas del sistema.</p>
            </div>
          </router-link>

          <router-link to="/soporte">
            <div
              class="bg-white text-blue-600 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <h2 class="text-xl font-bold flex items-center">
                <span class="material-icons mr-3">headset_mic</span> Soporte
              </h2>
              <p class="mt-2 text-sm">Accede al centro de ayuda y soporte técnico.</p>
            </div>
          </router-link>

          <router-link to="/roles">
            <div
              class="bg-white text-blue-600 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <h2 class="text-xl font-bold flex items-center">
                <span class="material-icons mr-3">shield</span> Roles
              </h2>
              <p class="mt-2 text-sm">Gestiona los roles y permisos de los usuarios.</p>
            </div>
          </router-link>

          <router-link to="/grupos">
            <div
              class="bg-white text-blue-600 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <h2 class="text-xl font-bold flex items-center">
                <span class="material-icons mr-3">group_work</span> Grupos
              </h2>
              <p class="mt-2 text-sm">Organiza a los usuarios en grupos específicos.</p>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>
