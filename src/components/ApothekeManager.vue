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
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useApothekeStore } from '@/stores/apothekeStore'
import { RouterLink } from 'vue-router'

// Используем хранилище
const apothekeStore = useApothekeStore()

// Реактивные данные
const newApothekeName = ref('')

// Извлекаем apothekes с помощью storeToRefs
const { apothekes } = storeToRefs(apothekeStore)

// Загружаем аптечки при создании компонента
apothekeStore.fetchApothekes()

// Метод для добавления аптечки
const addApotheke = async () => {
  if (newApothekeName.value.trim()) {
    await apothekeStore.addApotheke(newApothekeName.value)
    newApothekeName.value = ''
  }
}

// Метод для удаления аптечки
const removeApotheke = async (apothekeId: string) => {
  await apothekeStore.removeApotheke(apothekeId)
}
</script>
