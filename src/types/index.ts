// src/types/index.ts
export interface User {
  email: string
  apothekes: string[]
  sharedUsers: string[] // Пользователи с полным доступом
}

export interface Apotheke {
  id: string
  name: string
  ownerEmail: string
  medicines: Medicine[]
}

export interface Medicine {
  name: string
  expiryDate: string
  price?: number
  quantity?: number
  description?: string
  category?: string
  supplier?: string
  purchaseDate?: string
  notes?: string[]
}
