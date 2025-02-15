import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import HomeView from '@/views/HomeView.vue'
import AuthView from '@/views/AuthView.vue'
import ApothekeView from '@/views/ApothekeView.vue'

// Определяем маршруты
const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: { requiresAuth: true }, // Требует авторизации
  },
  {
    path: '/auth',
    name: 'Auth',
    component: AuthView,
    meta: { requiresAuth: false }, // Не требует авторизации
  },
  {
    path: '/apotheke/:id', // Динамический маршрут для страницы аптечки
    name: 'Apotheke',
    component: ApothekeView,
    props: true, // Передаём параметр `id` как пропс
    meta: { requiresAuth: true }, // Требует авторизации
  },
]

// Создаём роутер
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // Теперь TypeScript знает о import.meta.env
  routes,
})

// Навигационная защита
router.beforeEach(async (to, from, next) => {
  const auth = getAuth() // Получаем экземпляр Firebase Auth

  // Проверяем, требует ли маршрут авторизации
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  // Если маршрут не требует авторизации, разрешаем доступ
  if (!requiresAuth) {
    next()
    return
  }

  // Ожидаем завершения проверки состояния аутентификации
  const user = await new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => resolve(user))
  })

  // Если пользователь авторизован, разрешаем доступ
  if (user) {
    next()
  } else {
    // Если пользователь не авторизован, перенаправляем на страницу авторизации
    next({ name: 'Auth' })
  }
})

export default router
