import { useEffect, useState } from "react"
import CurrentUser, { User } from "./current_user"
import style from "../styles/Header.module.scss"
import Link from "next/link"

const cartUrl = process.env.NEXT_PUBLIC_MYPAGE_URL

const Header = () => {
  const [user, setUser] = useState<User | null | undefined>(undefined)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const currentUser = new CurrentUser()
    currentUser.start((user) => {
      console.log("user state change", user)
      if (user) {
        setUser(user)
      } else {
        setUser(null)
      }
    })
    setUser(currentUser.user)
    return () => {
      currentUser.stop()
    }
  }, [])
  return (
    <div className={style.header}>
      {user === undefined ? (
        "..loading"
      ) : user === null ? (
        <a href={cartUrl}>ログイン</a>
      ) : (
        <a href={cartUrl + `/mypage`}>{user.username} さん</a>
      )}
    </div>
  )
}

export default Header
