import Cookies from "js-cookie"
import { diff } from "deep-diff"
import jwt_decode from "jwt-decode"
import axios from "axios"

export const cartUserInfoKey = "cart_user_info"
export type User = {
  id: string
  username: string
  token: string
}
export type UserChangedEventCallBack = (user: User | null) => void

const tokenGeneratorApiEndpoint = process.env.NEXT_PUBLIC_TOKEN_API_ENDPOINT

export default class Session {
  public _user: User | null = null
  public tid: NodeJS.Timer | null = null
  public cb?: UserChangedEventCallBack
  public cookieCheckCounter: number = 0
  constructor() {
    this.loadFromCookie()
  }
  get user() {
    return Object.keys(this._user || {}).length > 0 ? this._user : null
  }
  get token() {
    return this.user?.token ? this.user?.token : null
  }

  userValue(_user: User | {}): User | null {
    return Object.keys(_user || {}).length > 0 ? (_user as User) : null
  }
  loadFromCookie() {
    const cookieValue = JSON.parse(Cookies.get(cartUserInfoKey) || "{}")
    const user = this.userValue(cookieValue)

    const changed = diff(this._user, user)
    if (changed) {
      //console.log(changed)
      this._user = user
      if (this.cb) this.cb(this.user)
    }
    return changed
  }
  // cookieを監視して、変化があったら cbを呼び出す
  start(cb?: UserChangedEventCallBack) {
    if (this.tid) return
    this.cb = cb
    this.tid = setInterval(() => {
      this.loadFromCookie()
      this.cookieCheckCounter += 1
    }, 1000)
    return this
  }
  stop() {
    if (this.tid) {
      clearInterval(this.tid)
      this.tid = null
    }
    return this
  }
  _verifyTokenExpired(token: string) {
    const decoded = jwt_decode<{ exp: number }>(token)
    //console.log(Date.now(), decoded.exp * 1000)
    return Date.now() > decoded.exp * 1000
  }
  async _refreshToken() {
    const url = `${tokenGeneratorApiEndpoint}/token`
    const user = await axios
      .get(url, { withCredentials: true })
      .then((ret) => ret.data)
      .catch(() => null)
    //console.log({ user })
    if (user) Cookies.set(cartUserInfoKey, user)
    else Cookies.remove(cartUserInfoKey)
    this._user = user
    return this.token
  }
  async firebase_custom_token() {
    const token = this.token
    if (token) {
      if (this._verifyTokenExpired(token)) {
        return await this._refreshToken()
      }
    }
    return token
  }
}
