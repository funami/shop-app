import { db } from "./firebase"
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
  datetime?: Date
  uid?: string
  count?: number
}
export const HistoryLogger = {
  log: async (data: History) => {
    if (!data.datetime) {
      data.datetime = new Date()
    }
    const newLogRef = doc(collection(db, "histories"))
    const userHistoryRef = doc(
      db,
      "users",
      data.uid || "",
      data.category,
      data.docId
    )
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
    const lastDoc = lastVisible
      ? await getDoc(doc(db, "users", uid, category, lastVisible))
      : null

    const q = lastDoc
      ? query(
          collection(db, "users", `${uid}`, category),
          where("uid", "==", uid),
          orderBy("datetime", "desc"),
          startAfter(lastDoc),
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
