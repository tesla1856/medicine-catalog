import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth' // Импортируем Firebase Auth
import HomeView from '@/views/HomeView.vue' // Главная страница
import AuthView from '@/views/AuthView.vue' // Страница авторизации
import ApothekeView from '@/views/ApothekeView.vue' // Страница конкретной аптечки

// Определяем маршруты
const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/auth',
    name: 'Auth',
    component: AuthView,
  },
  {
    path: '/apotheke/:id', // Динамический маршрут для страницы аптечки
    name: 'Apotheke',
    component: ApothekeView,
    props: true, // Передаём параметр `id` как пропс
  },
]

// Создаём роутер
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Навигационная защита
router.beforeEach((to, from, next) => {
  const auth = getAuth() // Получаем экземпляр Firebase Auth

  // Проверяем состояние аутентификации
  onAuthStateChanged(auth, (user) => {
    if (to.name !== 'Auth' && !user) {
      // Если пользователь не авторизован и пытается перейти на защищённый маршрут
      next({ name: 'Auth' }) // Перенаправляем на страницу авторизации
    } else {
      // Если пользователь авторизован или маршрут не требует авторизации
      next() // Разрешаем доступ
    }
  })
})

export default router
