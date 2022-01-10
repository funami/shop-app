import type { NextPage } from "next"
import { useState, useEffect } from "react"

const Token: NextPage = () => {
  const [firebaseJwtToken, setFirebaseJwtToken] = useState<any>({})
  useEffect(() => {
    window.addEventListener("storage", (e) => {
      if (e.key == "jwt_token") {
        console.log("jwt_token EVENT", e)
        setFirebaseJwtToken(JSON.parse(e.newValue || "{}"))
      }
    })
    const token = window.localStorage.getItem("jwt_token")
    setFirebaseJwtToken(JSON.parse(token || "{}"))
  }, [])

  return (
    <div>
      {firebaseJwtToken["username"]
        ? `「${firebaseJwtToken["username"]}」さんでログイン中`
        : "ログアウト中"}
    </div>
  )
}

export default Token
