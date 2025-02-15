import { defineStore } from 'pinia'
import { db } from '@/firebase'
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  arrayUnion,
} from 'firebase/firestore'
import type { Apotheke, Medicine } from '@/types'

export const useApothekeStore = defineStore('apotheke', {
  state: () => ({
    apothekes: [] as Apotheke[], // Список аптечек
  }),
  actions: {
    async fetchUserApothekes(ownerEmail: string) {
      console.log('feach', { ownerEmail })

      const q = query(collection(db, 'apothekes'), where('ownerEmail', '==', ownerEmail))
      const querySnapshot = await getDocs(q)
      this.apothekes = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Apotheke)
    },

    async addApotheke(name: string, ownerEmail: string) {
      try {
        const newApotheke = {
          name,
          ownerEmail,
          medicines: [],
        }

        const apothekeRef = await addDoc(collection(db, 'apothekes'), newApotheke)

        const userRef = doc(db, 'users', ownerEmail)
        await updateDoc(userRef, {
          apothekes: arrayUnion(apothekeRef.id), // Добавляем ID аптечки в массив владельца
        })

        // Добавляем аптечку в локальное состояние
        this.apothekes.push({ id: apothekeRef.id, ...newApotheke })
      } catch (error) {
        console.error('Ошибка при добавлении аптечки:', error)
        throw error // Пробрасываем ошибку для обработки в компоненте
      }
    },

    async removeApotheke(apothekeId: string, ownerEmail: string) {
      await deleteDoc(doc(db, 'apothekes', apothekeId))
      this.apothekes = this.apothekes.filter((a) => a.id !== apothekeId)
    },

    // Добавление лекарства в аптечку
    async addMedicine(apothekeId: string, medicine: Medicine) {
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
    async removeMedicine({
      apothekeId,
      medicineName,
    }: {
      apothekeId: string
      medicineName: string
    }) {
      const apothekeRef = doc(db, 'apothekes', apothekeId)
      const apotheke = this.apothekes.find((apotheke) => apotheke.id === apothekeId)

      if (apotheke) {
        // Фильтруем лекарства
        const updatedMedicines = apotheke.medicines.filter(
          (medicine) => medicine.name !== medicineName,
        )
        await updateDoc(apothekeRef, { medicines: updatedMedicines })

        // Обновляем состояние
        apotheke.medicines = updatedMedicines
      }
    },
  },
})
