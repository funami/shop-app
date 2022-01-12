import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import axios from "axios"
//console.log(process.env.NEXT_PUBLIC_FIREBASE_CONFIG)
export const firebaseConfig = JSON.parse(
  process.env.NEXT_PUBLIC_FIREBASE_CONFIG || "{}"
)

export const firebaseApp = initializeApp(firebaseConfig)
export const db = getFirestore()
export const auth = getAuth()
