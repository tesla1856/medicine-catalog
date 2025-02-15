import { defineStore } from 'pinia'
import { db, auth } from '@/firebase'
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import type { FieldValue } from 'firebase/firestore'
import type { User } from '@/types/users'

export const useUsersStore = defineStore('user', {
  state: () => ({
    currentUser: null as string | null, // Текущий пользователь (email)
  }),
  getters: {
    getCurrentUser: (state) => state.currentUser, // Геттер для текущего пользователя
  },
  actions: {
    // Инициализация слушателя авторизации
    initAuthListener() {
      onAuthStateChanged(auth, (user) => {
        this.currentUser = user ? user.email : null // Сохраняем email текущего пользователя
      })
    },

    // Поиск пользователя по email
    async findUserByEmail(email: string) {
      const userDoc = await getDoc(doc(db, 'users', email)) // Используем email как ID документа
      if (!userDoc.exists()) {
        return null
      }
      return userDoc.data() as User
    },

    // Предоставление доступа к аптечке
    async shareApotheke(ownerEmail: string, apothekeId: string, sharedUserEmail: string) {
      try {
        const userRef = doc(db, 'users', ownerEmail)
        const userDoc = await getDoc(userRef)

        if (!userDoc.exists()) {
          throw new Error('Пользователь не найден')
        }

        const sharedWith = userDoc.data().sharedWith || {}
        if (!sharedWith[sharedUserEmail]) {
          sharedWith[sharedUserEmail] = []
        }

        // Проверяем, что аптечка ещё не добавлена
        if (!sharedWith[sharedUserEmail].includes(apothekeId)) {
          sharedWith[sharedUserEmail].push(apothekeId)
          await updateDoc(userRef, { sharedWith })
        }
      } catch (error) {
        console.error('Ошибка при предоставлении доступа:', error)
        throw error
      }
    },

    // Отзыв доступа к аптечке
    async revokeAccess(ownerEmail: string, apothekeId: string, sharedUserEmail: string) {
      try {
        const userRef = doc(db, 'users', ownerEmail)
        const userDoc = await getDoc(userRef)

        if (!userDoc.exists()) {
          throw new Error('Пользователь не найден')
        }

        const sharedWith = userDoc.data().sharedWith || {}
        if (sharedWith[sharedUserEmail]) {
          // Удаляем ID аптечки из массива
          sharedWith[sharedUserEmail] = sharedWith[sharedUserEmail].filter(
            (id: string) => id !== apothekeId,
          )
          await updateDoc(userRef, { sharedWith })
        }
      } catch (error) {
        console.error('Ошибка при отзыве доступа:', error)
        throw error
      }
    },

    // Обновление данных пользователя
    async updateUser(
      email: string,
      data: Partial<Omit<User, 'apothekes'> & { apothekes?: FieldValue }>,
    ) {
      const userRef = doc(db, 'users', email)
      await updateDoc(userRef, data)
    },
  },
})
