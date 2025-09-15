import './main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import Vue3Toastify, {type ToastContainerOptions} from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import './assets/css/global.css'

import 'vue3-timepicker/dist/VueTimepicker.css'

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
ChartJS.defaults.font.family = 'Poppins'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Vue3Toastify,{
    autoclose: 3000
})

app.mount('#app')
