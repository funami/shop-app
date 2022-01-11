import { useEffect, useState } from "react"
import CurrentUser, { User } from "./current_user"
import style from "../styles/Header.module.scss"
import Link from "next/link"
import Grid from "@mui/material/Grid"

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
    <Grid container fontSize={14} className={style.header}>
      <Grid container paddingX={2}>
        <Grid item xs={6}>
          <span className={style.shop_link}>
            <Link href="/">
              <a>HOME</a>
            </Link>
          </span>
          <span className={style.shop_link}>
            <Link href="/items">
              <a>SHOP</a>
            </Link>
          </span>
        </Grid>
        <Grid item xs={6} textAlign="right">
          {user === undefined ? (
            "..loading"
          ) : user === null ? (
            <a href={cartUrl}>ログイン</a>
          ) : (
            <a href={cartUrl + `/mypage`}>{user.username}さん</a>
          )}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Header
