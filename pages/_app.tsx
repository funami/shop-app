import "../styles/globals.css"
import styles from "../styles/Home.module.css"
import type { AppProps } from "next/app"
import Header from "../components/header"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      <div className={styles.container}>
        <Component {...pageProps} />
      </div>
    </>
  )
}

export default MyApp
