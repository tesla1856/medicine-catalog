import { createApp } from 'vue'
import { createPinia } from 'pinia' // Импортируем Pinia
import App from './App.vue'
import router from './router'
import { useUsersStore } from '@/stores/usersStore'

// Создаём экземпляр Pinia
const pinia = createPinia()

// Создаём приложение Vue
const app = createApp(App)

// Используем Pinia и роутер
app.use(pinia) // Подключаем Pinia
app.use(router)

// Инициализация слушателя аутентификации
const userStore = useUsersStore()
userStore.initAuthListener()

// Монтируем приложение
app.mount('#app')
