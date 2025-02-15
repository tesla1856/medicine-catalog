import { defineStore } from 'pinia'
import { db, auth } from '@/firebase'
import { doc, setDoc, updateDoc, getDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
import { onAuthStateChanged, signOut, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import type { FieldValue } from 'firebase/firestore'
import type { User } from '@/types'
import { useApothekeStore } from '@/stores/apothekeStore'

export const useUsersStore = defineStore('user', {
  state: () => ({
    currentUser: null as string | null,
  }),
  getters: {
    getCurrentUser: (state) => state.currentUser,
  },
  actions: {
    initAuthListener() {
      const apothekeStore = useApothekeStore()
      onAuthStateChanged(auth, async (user) => {
        if (user && user.email) {
          this.currentUser = user.email
          await apothekeStore.fetchUserApothekes(this.currentUser)
        } else {
          this.currentUser = null
          apothekeStore.apothekes = []
        }
      })
    },

    async createUserIfNotExists(email: string) {
      const userRef = doc(db, 'users', email)
      const userDoc = await getDoc(userRef)

      if (!userDoc.exists()) {
        await setDoc(userRef, {
          email,
          apothekes: [],
          sharedUsers: [],
        })
      }
    },

    async signInWithGoogle() {
      const provider = new GoogleAuthProvider()
      try {
        const result = await signInWithPopup(auth, provider)
        if (result.user.email) {
          this.currentUser = result.user.email
          await this.createUserIfNotExists(result.user.email)
        }
      } catch (error) {
        console.error('Ошибка авторизации:', error)
      }
    },

    // async findUserByEmail(email: string) {
    //   const userDoc = await getDoc(doc(db, 'users', email)) // Используем email как ID документа
    //   if (!userDoc.exists()) {
    //     return null
    //   }
    //   return userDoc.data() as User
    // },

    // Обновление данных пользователя
    // async updateUser(
    //   email: string,
    //   data: Partial<Omit<User, 'apothekes'> & { apothekes?: FieldValue }>,
    // ) {
    //   const userRef = doc(db, 'users', email)
    //   await updateDoc(userRef, data)
    // },

    async logout() {
      try {
        await signOut(auth) // Выход из системы
        this.currentUser = null // Сбрасываем текущего пользователя
      } catch (error) {
        console.error('Ошибка при выходе:', error)
      }
    },

    async shareAccess(ownerEmail: string, sharedEmail: string) {
      const userRef = doc(db, 'users', ownerEmail)
      await updateDoc(userRef, {
        sharedUsers: arrayUnion(sharedEmail),
      })
    },
    async revokeAccess(ownerEmail: string, sharedEmail: string) {
      const userRef = doc(db, 'users', ownerEmail)
      await updateDoc(userRef, {
        sharedUsers: arrayRemove(sharedEmail),
      })
    },
  },
})
