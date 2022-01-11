import type { NextPage } from "next"
import styles from "../styles/Home.module.scss"
import Link from "next/link"

const Home: NextPage = () => {
  return (
    <div>
      <Link href="/items">
        <a>Items</a>
      </Link>
    </div>
  )
}

export default Home
