<template>
  <div>
    <h2>{{ apotheke.name }}</h2>
    <input v-model="newMedicineName" placeholder="Название лекарства" />
    <input v-model="newMedicineExpiryDate" type="date" placeholder="Срок годности" />
    <button @click="addMedicine">Добавить лекарство</button>

    <ul>
      <li v-for="medicine in apotheke.medicines" :key="medicine.name">
        {{ medicine.name }} (до {{ medicine.expiryDate }})
        <button @click="removeMedicine(medicine.name)" class="icon-button">
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
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useApothekeStore } from '@/stores/apothekeStore'
import type { Apotheke, Medicine } from '@/types'

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
    const newMedicine: Medicine = {
      name: newMedicineName.value,
      expiryDate: newMedicineExpiryDate.value,
    }
    await apothekeStore.addMedicine(props.apotheke.id, newMedicine)
    newMedicineName.value = ''
    newMedicineExpiryDate.value = ''
  }
}

// Метод для удаления лекарства
const removeMedicine = async (medicineName: string) => {
  await apothekeStore.removeMedicine({ apothekeId: props.apotheke.id, medicineName })
}
</script>

<style>
.icon-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-left: 0.5rem;
  display: inline-flex;
  align-items: center;
}

.icon-button svg {
  width: 20px;
  height: 20px;
  color: #ff4d4d; /* Цвет иконки */
}

.icon-button:hover svg {
  color: #ff1a1a; /* Цвет иконки при наведении */
}
</style>
