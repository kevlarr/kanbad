import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Head } from 'next/document'

import Header from '@/components/Header/Header'

export default function App({ Component, pageProps }: AppProps) {

  return (
    <>
      <Head>
        <title>Kanbad</title>
      </Head>
      <Header />
      <Component {...pageProps} />
    </>
  )
}
