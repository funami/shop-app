import { useState, useEffect } from "react"
export default function Receiver() {
  const [currentPathname, setCurrentPathname] = useState("")

  useEffect(() => {
    const {
      location: { pathname },
    } = window
    console.log("addEventListener:message")
    window.addEventListener("message", receiveMessage, false)
    setCurrentPathname(pathname)
  }, [setCurrentPathname])
  const receiveMessage = (event: MessageEvent<any>) => {
    console.log("event", event)
    if (event.origin !== "http://127.0.0.1:3000") return
    console.log(event)
  }

  return <div></div>
}
