<template>
  <div class="access-denied">
    <div class="content">
      <h1>¡Vaya! Algo salió mal</h1>
      <p>La página que buscas no está disponible o no tienes acceso para verla.</p>
      <p>Serás redirigido en <strong>{{ countdown }}</strong> segundos...</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AccessDenied',
  data() {
    return {
      countdown: 5,
    };
  },
  created() {
    this.startCountdown();
  },
  methods: {
    startCountdown() {
      const interval = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          clearInterval(interval);
          this.goBack();
        }
      }, 1000);
    },
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
.access-denied {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f7f7f7;
  font-family: 'Roboto', sans-serif;
}

.content {
  text-align: center;
  background-color: #ffffff;
  padding: 40px 50px;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
}

h1 {
  font-size: 2.5em;
  color: #e74c3c;
  margin-bottom: 20px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

p {
  font-size: 1.3em;
  color: #7f8c8d;
  margin-bottom: 25px;
  line-height: 1.6;
}

strong {
  font-size: 1.4em;
  color: #f39c12;
}

button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 12px 28px;
  font-size: 1.1em;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.3s, transform 0.3s;
  font-weight: 500;
}

button:hover {
  background-color: #2980b9;
  outline: none;
  transform: translateY(-3px);
}

button:active {
  transform: translateY(1px);
}
</style>
