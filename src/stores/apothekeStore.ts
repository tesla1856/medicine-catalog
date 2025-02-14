import { defineStore } from 'pinia'
import { db } from '@/firebase'
import { collection, addDoc, doc, updateDoc, deleteDoc, getDocs } from 'firebase/firestore'
import type { Apotheke, Medicine } from '@/types/types'

export const useApothekeStore = defineStore('apotheke', {
  state: () => ({
    apothekes: [] as Apotheke[],
  }),
  actions: {
    // Загрузка аптечек из Firestore
    async fetchApothekes() {
      const querySnapshot = await getDocs(collection(db, 'apothekes'))
      this.apothekes = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Apotheke[]
    },

    // Добавление аптечки в Firestore
    async addApotheke(name: string) {
      const newApotheke = {
        name,
        medicines: [],
      }
      const docRef = await addDoc(collection(db, 'apothekes'), newApotheke)
      this.apothekes.push({ id: docRef.id, ...newApotheke })
    },

    // Удаление аптечки из Firestore
    async removeApotheke(apothekeId: string) {
      await deleteDoc(doc(db, 'apothekes', apothekeId))
      this.apothekes = this.apothekes.filter((apotheke) => apotheke.id !== apothekeId)
    },

    // Добавление лекарства в аптечку в Firestore
    async addMedicine({ apothekeId, medicine }: { apothekeId: string; medicine: Medicine }) {
      const apothekeRef = doc(db, 'apothekes', apothekeId)
      const apotheke = this.apothekes.find((apotheke) => apotheke.id === apothekeId)
      if (apotheke) {
        const updatedMedicines = [...apotheke.medicines, medicine]
        await updateDoc(apothekeRef, { medicines: updatedMedicines })
        apotheke.medicines = updatedMedicines
      }
    },

    // Удаление лекарства из аптечки в Firestore
    async removeMedicine({ apothekeId, medicineId }: { apothekeId: string; medicineId: string }) {
      const apothekeRef = doc(db, 'apothekes', apothekeId)
      const apotheke = this.apothekes.find((apotheke) => apotheke.id === apothekeId)
      if (apotheke) {
        const updatedMedicines = apotheke.medicines.filter((medicine) => medicine.id !== medicineId)
        await updateDoc(apothekeRef, { medicines: updatedMedicines })
        apotheke.medicines = updatedMedicines
      }
    },
  },
})
