import flatCache from "flat-cache"
const cache = flatCache.load("shop-app")
class ApiJsonDataFetcher {
  public store: Record<string, any> = {}
  async getData(url: string) {
    if (!cache.getKey(url)) {
      console.log("load data to cache", url)
      const res = await fetch(url)
      const result = await res.json()
      cache.setKey(url, result)
      cache.save()
    } else {
      console.log("from cache", url)
    }
    return cache.getKey(url)
  }
}
export default new ApiJsonDataFetcher()
