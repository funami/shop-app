import { useEffect, useState } from "react"
import CurrentUser, { User } from "./current_user"
import style from "../styles/Header.module.scss"
const Header = () => {
  const [user, setUser] = useState<User | null | undefined>(undefined)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const currentUser = new CurrentUser()
    currentUser.start((user) => {
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
      {user === undefined
        ? "..loading"
        : user === null
        ? "ログインしていません"
        : `${user.username} さんでログイン中`}
    </div>
  )
}

export default Header
