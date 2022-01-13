import Link from "next/link"
import * as React from "react"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"
import Typography from "@mui/material/Typography"

import Grid from "@mui/material/Grid"
import ApiJsonDataFetcher from "../../src/api_json_data_fetcher"

export type Product = {
  id: string
  title: string
  description: string
  price: string
  image: string
}

const convertToProduct = (item: Record<string, any>): Product => {
  return {
    id: item.id,
    title: item.name,
    description: item.catch,
    price: item.budget.average,
    image: item.photo.pc.l,
  }
}

export const getHotpepperData = async (): Promise<Product[]> => {
  const res = await ApiJsonDataFetcher.getData(
    "https://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=023e1e925400ee66&large_area=Z011&format=json&count=100"
  )
  return res.results.shop.map(convertToProduct)
}

const MediaCard = (item: Product) => {
  return (
    <Card sx={{ maxWidth: 200, minHeight: 300 }}>
      <CardMedia
        component="img"
        height="150"
        image={item.image}
        alt={item.title}
      />
      <CardContent>
        <Typography gutterBottom variant="caption" component="div">
          <Link href="/items/[id]" as={`/items/${item.id}`}>
            {item.title}
          </Link>
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          <Link href="/items/[id]" as={`/items/${item.id}`}>
            {item.description}
          </Link>
        </Typography>
      </CardContent>
    </Card>
  )
}

const Item = ({ items }: { items: Product[] }) => {
  return (
    <Grid container>
      {items.map((item) => (
        <Grid key={item.id} marginRight={2} marginBottom={1}>
          <MediaCard {...item}></MediaCard>
        </Grid>
      ))}
    </Grid>
  )
}

export const getStaticProps = async () => {
  const items = await getHotpepperData()
  return { props: { items } }
}

export default Item
