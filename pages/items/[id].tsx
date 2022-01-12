import { GetStaticProps } from "next"
import Link from "next/link"
import styles from "../../styles/Item.module.scss"
import { Product } from "./index"

const Item = ({ item }: { item: Product }) => {
  return (
    <>
      <Link href="/items">
        <a>items</a>
      </Link>
      <h1>{item?.title}</h1>
      <div className={styles.description}>{item?.description}</div>
      <div className={styles.price}>price: {item?.price}</div>
    </>
  )
}

export const getStaticPaths = async () => {
  // 記事を取得する外部APIのエンドポイントをコール
  const res = await fetch(
    "https://61c91de420ac1c0017ed8b47.mockapi.io/api/v1/items"
  )
  const items = await res.json()

  // 記事にもとづいてプリレンダするパスを取得
  const paths = items
    .map((item: Product) => {
      return { params: { id: item.id } }
    })
    .slice(0, 1)

  // 設定したパスのみ、ビルド時にプリレンダ
  // { fallback: false } は、他のルートが404になるという意味
  return { paths, fallback: true }
}

interface Props {
  item: Product
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  console.log({ params: JSON.stringify(params) })
  // 投稿記事を取得する外部APIエンドポイントをコール
  const res = await fetch(
    `https://61c91de420ac1c0017ed8b47.mockapi.io/api/v1/items/${params?.id}`
  )
  const item = await res.json()
  // { props: posts }を返すことで、ビルド時にBlogコンポーネントが
  // `posts`をpropとして受け取れる
  return {
    props: { item },
  }
}

export default Item
