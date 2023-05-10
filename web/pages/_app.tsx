import type { AppProps } from 'next/app'
import Head from 'next/head'
import Link from 'next/link'

import { Heading } from '@/components/base'
import '@/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Kanbad</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>
      <Link href='/'>
        <Heading level={1}>kanbad</Heading>
      </Link>
      <Component {...pageProps} />
    </>
  )
}
