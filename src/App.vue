<template>
  <div>
    <nav>
      <router-link to="/">Главная</router-link>
      <router-link to="/auth">Авторизация</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<style>
/* Добавьте стили по желанию */
nav {
  padding: 1rem;
  background-color: #f0f0f0;
}

nav a {
  margin-right: 1rem;
  text-decoration: none;
  color: #333;
}

nav a.router-link-active {
  font-weight: bold;
}
</style>
