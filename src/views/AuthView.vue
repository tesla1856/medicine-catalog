<template>
  <div>
    <h1>Авторизация через Google</h1>
    <button @click="signInWithGoogle">Войти через Google</button>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth, googleProvider, signInWithPopup } from '@/firebase'

const error = ref('')
const router = useRouter()

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    console.log('Пользователь авторизован:', result.user)
    router.push('/')
  } catch (err) {
    error.value = 'Ошибка авторизации: ' + (err as Error).message
  }
}
</script>
