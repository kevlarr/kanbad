import type { AppProps } from 'next/app'
import Head from 'next/head'
import { MantineProvider } from '@mantine/core'

import '@/styles/globals.css'
import AppHeader from '@/components/AppHeader/AppHeader'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Kanbad</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <AppHeader />
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: 'light',
        }}
      >
        <Component {...pageProps} />
      </MantineProvider>
    </>
  )
}
