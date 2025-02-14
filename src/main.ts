import { createApp } from 'vue'
import { createPinia } from 'pinia' // Импортируем Pinia
import App from './App.vue'
import router from './router'

// Создаём экземпляр Pinia
const pinia = createPinia()

// Создаём приложение Vue
const app = createApp(App)

// Используем Pinia и роутер
app.use(pinia) // Подключаем Pinia
app.use(router)

// Монтируем приложение
app.mount('#app')
