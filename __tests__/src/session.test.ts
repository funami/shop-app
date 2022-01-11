import Cookies from "js-cookie"
import { advanceTo, clear } from "jest-date-mock"
import Session, { cartUserInfoKey } from "../../src/session"

jest.mock("axios")
import axios, { AxiosInstance } from "axios"
const testAxios: jest.Mocked<AxiosInstance> = axios as any

const cookie = {
  id: "8",
  username: "ABCD EFG",
  token:
    "eyJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJmaXJlYmFzZS1hZG1pbnNkay12bGUwaEB1c2VyLWRhdGEtZTYwZWYuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLCJzdWIiOiJmaXJlYmFzZS1hZG1pbnNkay12bGUwaEB1c2VyLWRhdGEtZTYwZWYuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLCJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImlhdCI6MTY0MTcxMTM4NywiZXhwIjoxNjQxNzE0OTg3LCJ1aWQiOjh9.RIkOK8NyjqJ-tysaTwFM--PCkgUU-wREIQiSmS5VICAoCrAghq__nUNHIuM0VFFUKxOJIjHVKAJus9ALx8w-_0nDQYvTFibPPtKdTS1rPN94KD0v_qehhY1Up65MfAzwp-4Gp9B8r-Rf5v-vv9-UW-TUCtGfKl_mhLkamKzds-uiyQo6j54_e8FrEYhs8yAab8WqhTM2pGbJw3R2h4axUv3seKFG9ZhVCAEa2DdP8AlrTfFjnK_tVFAtpxQX75JnPtq5tpfA2kztX21HZOdRJsF6T5NjSCZd9uTUCymRbUtMYfbawUV31d_WFiberXc5MRvxyseucR5ku1fo8kKcOg",
}
const cookie2 = {
  id: "8",
  username: "ABCD EFG",
  token: "",
}
const cookie3 = {
  id: "8",
  username: "ABCD EFG",
  token:
    "eyJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJmaXJlYmFzZS1hZG1pbnNkay12bGUwaEB1c2VyLWRhdGEtZTYwZWYuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLCJzdWIiOiJmaXJlYmFzZS1hZG1pbnNkay12bGUwaEB1c2VyLWRhdGEtZTYwZWYuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLCJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImlhdCI6MTY0MTcxMTM4NywiZXhwIjoxNjQxNzE0OTg3LCJ1aWQiOjh9.RIkOK8NyjqJ-tysaTwFM--PCkgUU-wREIQiSmS5VICAoCrAghq__nUNHIuM0VFFUKxOJIjHVKAJus9ALx8w-_0nDQYvTFibPPtKdTS1rPN94KD0v_qehhY1Up65MfAzwp-4Gp9B8r-Rf5v-vv9-UW-TUCtGfKl_mhLkamKzds-uiyQo6j54_e8FrEYhs8yAab8WqhTM2pGbJw3R2h4axUv3seKFG9ZhVCAEa2DdP8AlrTfFjnK_tVFAtpxQX75JnPtq5tpfA2kztX21HZOdRJsF6T5NjSCZd9uTUCymRbUtMYfbawUV31d_WFiberXc5MRvxyseucR5ku1fo8kKcOg",
}

test("loadFromCookie", async () => {
  Cookies.set(cartUserInfoKey, JSON.stringify(cookie)) // すでにcookieが存在している
  const current_user = new Session()
  expect(current_user.user).toMatchObject(cookie) // constractor時に一度loadFromCookieしているので、ここですでにuserが読み込まれている

  // loadFromCookieでcookieを確認。変化はない
  expect(current_user.loadFromCookie()).toBeFalsy()

  expect(current_user.user).toMatchObject(cookie)

  expect(current_user.user?.id).toEqual("8")
  expect(current_user.user?.username).toEqual("ABCD EFG")

  // cookieが変化した
  Cookies.set(cartUserInfoKey, JSON.stringify(cookie2))
  expect(current_user.loadFromCookie()).toBeTruthy()
  expect(current_user.user).toMatchObject(cookie2)

  current_user.stop()
})

test("user is aleady signined at cart.app", async () => {
  const mockCallback = jest.fn((x) => x)

  Cookies.remove(cartUserInfoKey) // 最初はcookieが存在しない状態から始める
  const current_user = new Session()
  expect(current_user.user).toBeNull()

  Cookies.set(cartUserInfoKey, JSON.stringify(cookie)) // すでにcookieが存在している
  let prevCounter = current_user.cookieCheckCounter
  current_user.start(mockCallback)
  await new Promise<void>((resolve) => {
    const tid = setInterval(() => {
      if (current_user.cookieCheckCounter > prevCounter) {
        clearInterval(tid)
        resolve()
      }
    }, 200)
  })
  expect(mockCallback.mock.calls.length).toBe(1)

  expect(current_user.user).toMatchObject(cookie)
  expect(current_user.user?.id).toEqual("8")
  expect(current_user.user?.username).toEqual("ABCD EFG")

  // cookieが変化した
  prevCounter = current_user.cookieCheckCounter
  Cookies.set(cartUserInfoKey, JSON.stringify(cookie2))
  await new Promise<void>((resolve) => {
    const tid = setInterval(() => {
      if (current_user.cookieCheckCounter > prevCounter) {
        clearInterval(tid)
        resolve()
      }
    }, 200)
  })
  expect(current_user.user).toMatchObject(cookie2)
  expect(mockCallback.mock.calls.length).toBe(2)

  prevCounter = current_user.cookieCheckCounter
  Cookies.set(cartUserInfoKey, JSON.stringify(cookie))
  await new Promise<void>((resolve) => {
    const tid = setInterval(() => {
      if (current_user.cookieCheckCounter > prevCounter) {
        clearInterval(tid)
        resolve()
      }
    }, 200)
  })
  expect(mockCallback.mock.calls.length).toBe(3)

  prevCounter = current_user.cookieCheckCounter
  Cookies.remove(cartUserInfoKey)
  await new Promise<void>((resolve) => {
    const tid = setInterval(() => {
      if (current_user.cookieCheckCounter > prevCounter) {
        clearInterval(tid)
        resolve()
      }
    }, 200)
  })
  expect(mockCallback.mock.calls.length).toBe(4)
  expect(mockCallback.mock.calls[0][0]).toEqual(cookie)
  expect(mockCallback.mock.calls[1][0]).toEqual(cookie2)
  expect(mockCallback.mock.calls[2][0]).toEqual(cookie)
  expect(mockCallback.mock.calls[3][0]).toEqual(null)
  current_user.stop()
})

test("_verifyTokenExpired", () => {
  const current_user = new Session()
  expect(current_user._verifyTokenExpired(cookie.token)).toBeTruthy()

  advanceTo(new Date(1641714987000)) // 有効
  expect(current_user._verifyTokenExpired(cookie.token)).toBeFalsy()

  advanceTo(new Date(1641714987001)) // 有効期限切れ
  expect(current_user._verifyTokenExpired(cookie.token)).toBeTruthy()
  clear()
})

test("firebase_custom_token", async () => {
  const current_user = new Session()

  // cookie なし
  Cookies.remove(cartUserInfoKey)
  current_user.loadFromCookie()
  await expect(current_user.firebase_custom_token()).resolves.toBeNull()

  // cookie あり、期間有効期間内
  advanceTo(new Date(1641714987000)) // 期間有効期間内
  Cookies.set(cartUserInfoKey, JSON.stringify(cookie))
  current_user.loadFromCookie()
  await expect(current_user.firebase_custom_token()).resolves.toEqual(
    cookie.token
  )
  clear()

  // cookie あり、期間有効期限切れ. refresh成功
  testAxios.get.mockResolvedValue({ data: cookie3 })
  advanceTo(new Date(1641714987001)) // 有効期限切れ
  Cookies.set(cartUserInfoKey, JSON.stringify(cookie))
  current_user.loadFromCookie()
  await expect(current_user.firebase_custom_token()).resolves.toEqual(
    cookie3.token
  )
  clear()

  // cookie あり、期間有効期限切れ. refresh失敗
  testAxios.get.mockRejectedValue({ data: { error: "Unauthorized" } })
  advanceTo(new Date(1641714987001)) // 有効期限切れ
  Cookies.set(cartUserInfoKey, JSON.stringify(cookie))
  current_user.loadFromCookie()
  await expect(current_user.firebase_custom_token()).resolves.toBeNull()
  clear()
})
