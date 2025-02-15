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
        <button @click="removeApotheke(apotheke.id)" class="icon-button">
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
    <input v-model="sharedUserEmail" placeholder="Введите email пользователя" />
    <button @click="grantAccess">Предоставить доступ</button>
    <button @click="revokeAccess">Отозвать доступ</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUsersStore } from '@/stores/usersStore'
import { useApothekeStore } from '@/stores/apothekeStore'
import { storeToRefs } from 'pinia'

const userStore = useUsersStore()
const apothekeStore = useApothekeStore()
const { currentUser } = storeToRefs(userStore)
const { apothekes } = storeToRefs(apothekeStore)

const newApothekeName = ref('')
const sharedUserEmail = ref('')

const addApotheke = async () => {
  if (newApothekeName.value.trim() && currentUser.value) {
    await apothekeStore.addApotheke(newApothekeName.value, currentUser.value)
    newApothekeName.value = ''
  }
}

const removeApotheke = async (apothekeId: string) => {
  if (currentUser.value) {
    await apothekeStore.removeApotheke(apothekeId, currentUser.value)
  }
}

const grantAccess = async () => {
  if (sharedUserEmail.value && currentUser.value) {
    await userStore.shareAccess(currentUser.value, sharedUserEmail.value)
  }
}

const revokeAccess = async () => {
  if (sharedUserEmail.value && currentUser.value) {
    await userStore.revokeAccess(currentUser.value, sharedUserEmail.value)
  }
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
