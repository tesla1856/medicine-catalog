import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBFjpoJhLKRukbv23ZRytoX2-OI8n88XMk',
  authDomain: 'medicine-catalog-20eb6.firebaseapp.com',
  projectId: 'medicine-catalog-20eb6',
  storageBucket: 'medicine-catalog-20eb6.firebasestorage.app',
  messagingSenderId: '1001484002226',
  appId: '1:1001484002226:web:f407ae665bdf6f6c8b3aab',
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

const googleProvider = new GoogleAuthProvider()

export { auth, db, googleProvider, signInWithPopup }
