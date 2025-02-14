<template>
  <div>
    <h2>Аптечка: {{ apotheke?.name }}</h2>
    <MedicineManager v-if="apotheke" :apotheke="apotheke" />
    <p v-else>Аптечка не найдена</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useApothekeStore } from '@/stores/apothekeStore'
import MedicineManager from '@/components/MedicineManager.vue'
import type { Apotheke } from '@/types/types'

// Получаем параметр `id` из маршрута
const props = defineProps<{
  id: string
}>()

// Используем хранилище
const apothekeStore = useApothekeStore()

// Находим аптечку по ID
const apotheke = computed(() => {
  return apothekeStore.apothekes.find((apotheke) => apotheke.id === props.id)
})

// Если аптечка не найдена, показываем сообщение
if (!apotheke.value) {
  console.error('Аптечка не найдена')
}
</script>
