<template>
  <nav>
    <router-link to="/">Главная</router-link>
    <span v-if="currentUser" style="margin-left: auto">
      {{ currentUser }}
      <button @click="logout" class="logout-button">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      </button>
    </span>
    <router-link v-else to="/auth">Авторизация</router-link>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useUsersStore } from '@/stores/usersStore'
import { storeToRefs } from 'pinia'

// Получаем хранилище и текущего пользователя
const userStore = useUsersStore()
const { currentUser } = storeToRefs(userStore)

// Метод для выхода
const logout = () => userStore.logout()
</script>

<style>
/* Добавьте стили по желанию */
nav {
  padding: 1rem;
  background-color: #271919;
  display: flex;
  align-items: center;
}

nav a,
span {
  margin-right: 1rem;
  text-decoration: none;
  color: #faffe1;
}

nav a.router-link-active {
  font-weight: bold;
}

.logout-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-left: 0.5rem;
  display: inline-flex;
  align-items: center;
}

.logout-button svg {
  width: 16px;
  height: 16px;
  color: #d7fd2d; /* Цвет иконки */
}

.logout-button:hover svg {
  color: #ff4d4d; /* Цвет иконки при наведении */
}
</style>
