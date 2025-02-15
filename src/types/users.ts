export interface User {
  email: string
  apothekes: string[] // Массив ID аптечек
  sharedWith: { [email: string]: string[] } // Доступы к аптечкам
}
