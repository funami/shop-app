import Navbar from "./navbar"
import Container from "@mui/material/Container"

import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { HistoryLogger, History } from "../src/history_logger"
import Session, { User } from "../src/session"

export default function Layout({ children }: { children: JSX.Element }) {
  const [page, setPage] = useState<History | null>(null)
  const router = useRouter()
  const [user, setUser] = useState<User | null | undefined>(undefined)

  /*   const sendLog = (user: User, page: History) => {
    if (user && page) {
      page.uid = user.id
      HistoryLogger.log(page)
    }
  } */
  useEffect(() => {
    const currentUser = new Session()
    currentUser.start((_user) => {
      console.log("user state change", _user)
      if (_user) {
        setUser(_user)
      } else {
        setUser(null)
      }
      console.log("current user is", user)
    })
    setUser(currentUser.user)
    console.log("Mount USER", user, currentUser.user)
    return () => {
      console.log("unmount setUser")
      currentUser.stop()
    }
  }, [])

  useEffect(() => {
    console.log("Mount Item", user)
    const handleRouteChange = (url: string) => {
      const _url = url.match(/\/items\/(\d+)/) || []
      if (_url[1]) {
        setPage({
          docId: _url[1],
          category: "products",
          url,
        })
      }
      console.log(`App is changing to ${url}`)
    }
    router.events.on("routeChangeStart", handleRouteChange)

    return () => {
      console.log("Unmount Item", user)
      router.events.off("routeChangeStart", handleRouteChange)
    }
  }, [])

  useEffect(() => {
    if (page && user) {
      console.log("send log for", page, user)
      page.uid = user.id
      HistoryLogger.log(page).then(() => {
        HistoryLogger.get(user.id, "products").then((ret) =>
          console.log(
            ret.map((v) => {
              return { docId: v.docId, dt: v.datetime }
            })
          )
        )
      })
    }
  }, [page, user])

  return (
    <>
      <Navbar user={user} />
      <Container>
        <main>{children}</main>
      </Container>
    </>
  )
}
