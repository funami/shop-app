/**
 * @jest-environment node
 */

import { db, auth } from "../../src/firebase"
import {
  signInWithCustomToken,
  connectAuthEmulator,
  signOut,
} from "firebase/auth"
import {
  collection,
  query,
  getDocs,
  where,
  connectFirestoreEmulator,
  DocumentReference,
  deleteDoc,
  doc,
} from "firebase/firestore"
import { HistoryLogger } from "../../src/history_logger"
import bluebird from "bluebird"

connectAuthEmulator(auth, "http://localhost:9099")
connectFirestoreEmulator(db, "localhost", 8080)

const token8 =
  "eyJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJmaXJlYmFzZS1hZG1pbnNkay12bGUwaEB1c2VyLWRhdGEtZTYwZWYuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLCJzdWIiOiJmaXJlYmFzZS1hZG1pbnNkay12bGUwaEB1c2VyLWRhdGEtZTYwZWYuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLCJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImlhdCI6MTY0MTg4NDI2MiwiZXhwIjoxNjQxODg0MzIyLCJ1aWQiOjh9.cC7jmRFZev_mjofK5t56NYtwZugK2Fzawpgj2UxI96uVUQHgG83rrrUlS9mB1hwKwuU6zQoxU2zsO15xYL7oSNaihUTJ_fQcS2O542GRCMux-580oXC40T5zNlZsotj_08QgVjGCT0gN4e0rx1tliIR-yLxrV-vxxHx_-0NTYuJ3ZiybDdai63dBnoftGffjoUa7JZ_1hMmvhVc6ydvoOMAnd68bi2MnUqQ9fS5zoPE5MZ-Fg1iDMfIdUZRhT6FXmdCGu0mM4mLb8q1ojX4g21Q09vEEv95UKG9gpY0lC06DNWdVYC6L1N4-vEaFmt1Eqp4FJQsewjekeWGRIQeedw"
const token12 =
  "eyJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJmaXJlYmFzZS1hZG1pbnNkay12bGUwaEB1c2VyLWRhdGEtZTYwZWYuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLCJzdWIiOiJmaXJlYmFzZS1hZG1pbnNkay12bGUwaEB1c2VyLWRhdGEtZTYwZWYuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLCJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImlhdCI6MTY0MTk1NzIwNywiZXhwIjoxNjQxOTU3MjY3LCJ1aWQiOjEyfQ.ZifgBVLbYPSbsf2ZL1pOZNwJUngwP7961pmCYulUNDoSQKOKDaOt3hZE_31OxNFc-_IkjpREt15zmGb0KqqVGp3gXSr67KgqJf2ZqadhdvdI1ooQu-l69RkRZxePMO-iortqxCO6xoJOj_LcK2E964XEP-GhmFcn5BSr6Xk7Fus-H7j2IuHZpb5MP0PN54LrOZ83OjkDUqlf2u_7tU_usCFdebzBFgQWfQPWuciz8DgC0x-tsuPV8gLRqxDlzIt94SU_OLi0qAZXGR008ZVfo4lwqh7sZOackfvAkjRnflCUCUxFNoahpU_ZeTbUVmr3SkAus_Dac7LkqS2ryEA_Xw"

describe("HistoryLogger.log", () => {
  beforeAll(async () => {
    await signInWithCustomToken(auth, token8)
  })
  afterAll(async () => {
    await signOut(auth)
  })
  test("uid is match", async () => {
    const data1 = {
      docId: "842",
      category: "products",
      url: "http://test/test",
      uid: "8",
      datetime: new Date(2021, 1, 1),
    }
    const data2 = {
      docId: "843",
      category: "products",
      url: "http://test/test",
      uid: "8",
      datetime: new Date(2021, 1, 2),
    }

    const historyRef = collection(db, "histories")
    const q = query(historyRef, where("uid", "==", "8"))
    const querySnapshot = await getDocs(q)
    const beforeCount = querySnapshot.docs.length

    await expect(HistoryLogger.log(data1)).resolves.toMatchObject(data1)
    await expect(HistoryLogger.log(data2)).resolves.toMatchObject(data2)
    await new Promise<void>((resolve) => {
      setTimeout(async () => {
        await expect(HistoryLogger.log(data2)).resolves.toMatchObject(data2)
        resolve()
      }, 1000)
    })
    const querySnapshot2 = await getDocs(q)
    const beforeCount2 = querySnapshot2.docs.length
    expect(beforeCount2 - beforeCount).toEqual(3) //差分３件が追加

    const userHistoryRef = collection(db, "users", "8", "products")
    const historyQ = query(userHistoryRef, where("uid", "==", "8"))
    const historyQuerySnapshot = await getDocs(historyQ)
    const historyBeforeCount = historyQuerySnapshot.docs.length
    expect(historyBeforeCount).toEqual(2) // id分2件のみ
  })
  test("uid is not match", async () => {
    // uid is not match
    await expect(
      HistoryLogger.log({
        docId: "842",
        category: "products",
        url: "http://test/test",
        uid: "9",
        datetime: new Date(),
      })
    ).rejects.toThrowError("PERMISSION_DENIED")
  })
})

describe("HistoryLogger.get", () => {
  const data1 = {
    docId: "842",
    category: "products",
    url: "http://test/test",
    uid: "12",
    datetime: new Date(2021, 1, 1),
  }
  const data2 = {
    docId: "843",
    category: "products",
    url: "http://test/test",
    uid: "12",
    datetime: new Date(2021, 1, 2),
  }
  const data3 = {
    docId: "844",
    category: "products",
    url: "http://test/test",
    uid: "12",
    datetime: new Date(2021, 1, 3),
  }
  beforeAll(async () => {
    await signInWithCustomToken(auth, token12)

    const q = query(
      collection(db, "users", "12", "products"),
      where("uid", "==", "12")
    )
    const querySnapshot = await getDocs(q).catch(() => [])
    const docRefs: DocumentReference[] = []
    querySnapshot.forEach((doc) => {
      docRefs.push(doc.ref)
    })
    await bluebird.map(docRefs, async (docRef) => {
      await deleteDoc(doc(db, "users", "12", "products", docRef.id))
    })
    await expect(HistoryLogger.log(data1)).resolves.toMatchObject(data1)
    await expect(HistoryLogger.log(data2)).resolves.toMatchObject(data2)
    await expect(HistoryLogger.log(data3)).resolves.toMatchObject(data3)
  })
  afterAll(async () => {
    await signOut(auth)
  })
  test("get all", async () => {
    const queryResultAll = await HistoryLogger.get("12", "products").then(
      (ret) => {
        //console.log(ret)
        return ret
      }
    )
    expect(queryResultAll).toMatchObject([data3, data2, data1])
  })
  test("get with limit", async () => {
    const queryResult = await HistoryLogger.get("12", "products", 2).then(
      (ret) => {
        console.log(ret)
        return ret
      }
    )
    expect(queryResult).toMatchObject([data3, data2])

    await expect(
      HistoryLogger.get("12", "products", 100, "843").then((ret) => {
        console.log(ret)
        return ret
      })
    ).resolves.toEqual([data1])
  })
})
