<template>
  <div>
    <h1>Авторизация через Google</h1>
    <button @click="signInWithGoogle">Войти через Google</button>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUsersStore } from '@/stores/usersStore'

const userStore = useUsersStore()
const error = ref('')

const signInWithGoogle = async () => {
  try {
    await userStore.signInWithGoogle()
  } catch (err) {
    error.value = 'Ошибка авторизации: ' + (err as Error).message
  }
}
</script>
