import Link from "next/link"

export type Product = {
  id: string
  title: string
  description: string
  price: string
  createdAt: Date
}
const Item = ({ items }: { items: Product[] }) => {
  return (
    <>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <Link href="/items/[id]" as={`/items/${item.id}`}>
              <a>{item.title}</a>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}

export const getStaticProps = async () => {
  // 投稿記事を取得する外部APIエンドポイントをコール
  const res = await fetch(
    "https://61c91de420ac1c0017ed8b47.mockapi.io/api/v1/items"
  )
  const items = await res.json()
  // { props: posts }を返すことで、ビルド時にBlogコンポーネントが
  // `posts`をpropとして受け取れる
  return { props: { items } }
}

export default Item
