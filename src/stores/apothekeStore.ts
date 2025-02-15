import { defineStore } from 'pinia'
import { db } from '@/firebase'
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore'
import { useUsersStore } from '@/stores/usersStore'
import type { Apotheke, Medicine } from '@/types/apothekes'

export const useApothekeStore = defineStore('apotheke', {
  state: () => ({
    apothekes: [] as Apotheke[], // Список аптечек
  }),
  actions: {
    // Загрузка аптечек по их ID
    async fetchApothekes(apothekeIds: string[]) {
      const apothekePromises = apothekeIds.map(async (id) => {
        const apothekeDoc = await getDoc(doc(db, 'apothekes', id))
        if (apothekeDoc.exists()) {
          return { id: apothekeDoc.id, ...apothekeDoc.data() } as Apotheke
        }
        return null
      })

      const apothekes = (await Promise.all(apothekePromises)).filter(
        (apotheke): apotheke is Apotheke => apotheke !== null,
      )
      this.apothekes = apothekes
    },

    // Добавление новой аптечки
    async addApotheke(name: string, ownerEmail: string) {
      const newApotheke = {
        name,
        medicines: [], // Пустой массив для лекарств
      }

      // Добавляем аптечку в Firestore
      const apothekeRef = await addDoc(collection(db, 'apothekes'), newApotheke)

      // Обновляем документ пользователя, добавляя ID новой аптечки
      const userStore = useUsersStore()
      await userStore.updateUser(ownerEmail, {
        apothekes: arrayUnion(apothekeRef.id),
      })

      // Добавляем аптечку в состояние
      this.apothekes.push({ id: apothekeRef.id, ...newApotheke })
    },

    // Удаление аптечки
    async removeApotheke(apothekeId: string, ownerEmail: string) {
      // Удаляем аптечку из Firestore
      await deleteDoc(doc(db, 'apothekes', apothekeId))

      // Обновляем документ пользователя, удаляя ID аптечки
      const userStore = useUsersStore()
      await userStore.updateUser(ownerEmail, {
        apothekes: arrayRemove(apothekeId),
      })

      // Удаляем аптечку из состояния
      this.apothekes = this.apothekes.filter((apotheke) => apotheke.id !== apothekeId)
    },

    // Добавление лекарства в аптечку
    async addMedicine({ apothekeId, medicine }: { apothekeId: string; medicine: Medicine }) {
      const apothekeRef = doc(db, 'apothekes', apothekeId)
      const apotheke = this.apothekes.find((apotheke) => apotheke.id === apothekeId)

      if (apotheke) {
        // Обновляем список лекарств
        const updatedMedicines = [...apotheke.medicines, medicine]
        await updateDoc(apothekeRef, { medicines: updatedMedicines })

        // Обновляем состояние
        apotheke.medicines = updatedMedicines
      }
    },

    // Удаление лекарства из аптечки
    async removeMedicine({ apothekeId, medicineId }: { apothekeId: string; medicineId: string }) {
      const apothekeRef = doc(db, 'apothekes', apothekeId)
      const apotheke = this.apothekes.find((apotheke) => apotheke.id === apothekeId)

      if (apotheke) {
        // Фильтруем лекарства
        const updatedMedicines = apotheke.medicines.filter((medicine) => medicine.id !== medicineId)
        await updateDoc(apothekeRef, { medicines: updatedMedicines })

        // Обновляем состояние
        apotheke.medicines = updatedMedicines
      }
    },
  },
})
