import Link from "next/link"
import Image from "next/image"
import styles from "../../styles/Item.module.scss"
import { Product, getHotpepperData } from "./index"

const Item = ({ item }: { item: Product }) => {
  return (
    <>
      <Link href="/items">
        <a>items</a>
      </Link>
      <h1>{item?.title}</h1>
      <div className={styles.description}>{item?.description}</div>
      <div className={styles.price}>price: {item?.price}</div>
      <img src={item?.image} />
    </>
  )
}

export const getStaticPaths = async () => {
  console.log("getStaticPaths")
  const items = await getHotpepperData()
  const paths = items.map((item: Product) => {
    return { params: { id: item.id } }
  })
  return { paths, fallback: true }
}

interface Props {
  item: Product
}

export const getStaticProps = async ({
  params,
}: {
  params: { id: string }
}) => {
  console.log("getStaticProps", { params: JSON.stringify(params) })
  const items = await getHotpepperData()
  const item = items.find((item: Product) => item.id == params.id)

  return {
    props: { item },
  }
}

export default Item
