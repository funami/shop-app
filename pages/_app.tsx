import "../styles/globals.css"
import { ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { CacheProvider, EmotionCache } from "@emotion/react"
import theme from "../src/theme"
import createEmotionCache from "../src/createEmotionCache"
import type { AppProps } from "next/app"
import Header from "../components/header"
import Container from "@mui/material/Container"

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}
// https://github.com/mui-org/material-ui/tree/master/examples/nextjs-with-typescript
// nextjsでmaterial uiを使うため、↑を参考に実装。CacheProviderが何者か、よくわかってない
function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props
  return (
    <>
      <CacheProvider value={emotionCache}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Header />
          <Container>
            <Component {...pageProps} />
          </Container>
        </ThemeProvider>
      </CacheProvider>
    </>
  )
}

export default MyApp
