<template>
  <div>
    <h1>Управление аптечками</h1>
    <input v-model="newApothekeName" placeholder="Название аптечки" />
    <button @click="addApotheke">Добавить аптечку</button>

    <ul>
      <li v-for="apotheke in apothekes" :key="apotheke.id">
        <router-link :to="`/apotheke/${apotheke.id}`">
          {{ apotheke.name }}
        </router-link>
        <button @click="removeApotheke(apotheke.id)">Удалить</button>
        <input v-model="sharedEmails[apotheke.id]" placeholder="Введите email пользователя" />
        <button @click="grantAccess(apotheke.id)">Предоставить доступ</button>
        <button @click="revokeAccess(apotheke.id)">Отозвать доступ</button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUsersStore } from '@/stores/usersStore'
import { useApothekeStore } from '@/stores/apothekeStore'
import { storeToRefs } from 'pinia'
import { doc, getDoc } from 'firebase/firestore' // Импортируем getDoc и doc
import { db } from '@/firebase' // Импортируем db

// Хранилища
const usersStore = useUsersStore()
const apothekeStore = useApothekeStore()

// Реактивные данные
const newApothekeName = ref('')
const sharedEmails = ref<Record<string, string>>({})

// Получаем текущего пользователя
const { currentUser } = storeToRefs(usersStore)

// Получаем список аптечек
const { apothekes } = storeToRefs(apothekeStore)

// Загружаем аптечки при монтировании компонента
onMounted(async () => {
  if (currentUser.value) {
    // Получаем документ пользователя по email
    const userDoc = await getDoc(doc(db, 'users', currentUser.value))
    if (userDoc.exists()) {
      const userData = userDoc.data()
      const apothekeIds = [
        ...(userData.apothekes || []),
        ...Object.values(userData.sharedWith || {}).flat(),
      ]
      await apothekeStore.fetchApothekes(apothekeIds)
    }
  }
})

// Добавление аптечки
const addApotheke = async () => {
  if (newApothekeName.value.trim() && currentUser.value) {
    await apothekeStore.addApotheke(newApothekeName.value, currentUser.value)
    newApothekeName.value = ''
  }
}

// Удаление аптечки
const removeApotheke = async (apothekeId: string) => {
  if (currentUser.value) {
    await apothekeStore.removeApotheke(apothekeId, currentUser.value)
  }
}

// Предоставление доступа к аптечке
const grantAccess = async (apothekeId: string) => {
  const email = sharedEmails.value[apothekeId]
  if (email && currentUser.value) {
    const sharedUser = await usersStore.findUserByEmail(email)
    if (sharedUser) {
      await usersStore.shareApotheke(currentUser.value, apothekeId, sharedUser.email)
    }
  }
}

// Отзыв доступа к аптечке
const revokeAccess = async (apothekeId: string) => {
  const email = sharedEmails.value[apothekeId]
  if (email && currentUser.value) {
    const sharedUser = await usersStore.findUserByEmail(email)
    if (sharedUser) {
      await usersStore.revokeAccess(currentUser.value, apothekeId, sharedUser.email)
    }
  }
}
</script>
