import { firebaseApp, db } from "./firebase"
import {
  collection,
  query,
  doc,
  orderBy,
  runTransaction,
  limit,
  getDocs,
  startAfter,
  where,
  getDoc,
} from "firebase/firestore"

export type History = {
  key?: string
  docId: string
  category: string
  url: string
  datetime: Date
  uid: string
  count?: number
}
export const HistoryLogger = {
  log: async (data: History) => {
    const newLogRef = doc(collection(db, "histories"))
    const userHistoryRef = doc(db, "users", data.uid, data.category, data.docId)
    const result = await runTransaction<History>(db, async (transaction) => {
      transaction.set(newLogRef, data).set(userHistoryRef, data)
      return data
    })
    return result
  },
  get: async (
    uid: string,
    category: string,
    _limit: number = 100,
    lastVisible?: string
  ) => {
    console.log({ lastVisible, _limit })
    const q = lastVisible
      ? query(
          collection(db, "users", `${uid}`, category),
          where("uid", "==", uid),
          orderBy("datetime", "desc"),
          startAfter(
            await getDoc(doc(db, "users", uid, category, lastVisible))
          ),
          limit(_limit)
        )
      : query(
          collection(db, "users", `${uid}`, category),
          where("uid", "==", uid),
          orderBy("datetime", "desc"),
          limit(_limit)
        )
    const documentSnapshots = await getDocs(q)
    const ret: History[] = []
    documentSnapshots.forEach((doc) => {
      ret.push(
        Object.assign(doc.data() as History, {
          datetime: doc.data().datetime.toDate(),
        })
      )
    })
    return ret
  },
}
