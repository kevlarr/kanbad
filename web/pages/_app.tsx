import type { AppProps } from 'next/app'
import Head from 'next/head'

import { PageHeader } from '@/components'
import '@/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Kanbad</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>
      <PageHeader />
      <Component {...pageProps} />
    </>
  )
}
