export interface Medicine {
  id: string
  name: string
  expiryDate: string
}

export interface Apotheke {
  id: string
  name: string
  medicines: Medicine[]
}
