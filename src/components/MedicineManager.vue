<template>
  <div>
    <h2>{{ apotheke.name }}</h2>
    <input v-model="newMedicineName" placeholder="Название лекарства" />
    <input v-model="newMedicineExpiryDate" type="date" placeholder="Срок годности" />
    <button @click="addMedicine">Добавить лекарство</button>

    <ul>
      <li v-for="medicine in apotheke.medicines" :key="medicine.id">
        {{ medicine.name }} (до {{ medicine.expiryDate }})
        <button @click="removeMedicine(medicine.id)">Удалить</button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useApothekeStore } from '@/stores/apothekeStore'
import type { Apotheke } from '@/types/apothekes'

// Определяем пропсы
const props = defineProps<{
  apotheke: Apotheke
}>()

// Реактивные данные
const newMedicineName = ref('')
const newMedicineExpiryDate = ref('')

// Используем хранилище
const apothekeStore = useApothekeStore()

// Метод для добавления лекарства
const addMedicine = async () => {
  if (newMedicineName.value.trim() && newMedicineExpiryDate.value) {
    const newMedicine = {
      id: `medicine-${Date.now()}`,
      name: newMedicineName.value,
      expiryDate: newMedicineExpiryDate.value,
    }
    await apothekeStore.addMedicine({ apothekeId: props.apotheke.id, medicine: newMedicine })
    newMedicineName.value = ''
    newMedicineExpiryDate.value = ''
  }
}

// Метод для удаления лекарства
const removeMedicine = async (medicineId: string) => {
  await apothekeStore.removeMedicine({ apothekeId: props.apotheke.id, medicineId })
}
</script>
