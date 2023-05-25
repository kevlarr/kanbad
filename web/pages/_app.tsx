import { useEffect, useState } from 'react'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'

import * as storage from '@/lib/storage'
import { PageHeader } from '@/components'
import '@/styles/globals.css'


export default function App({ Component, pageProps }: AppProps) {
  const [workspaces, setWorkspaces] = useState<Array<string>>([])
  const router = useRouter()

  useEffect(() => setWorkspaces(storage.getWorkspaces()), [])

  function addWorkspace(identifier: string) {
    storage.addWorkspace(identifier)
    setWorkspaces([...workspaces, identifier])
  }

  /* Need to assign a key to the component based on route in order for navigating
   * between dynamic routes (eg. different workspaces) to work properly and fetch
   * initial props on page change.
   *
   * See: https://github.com/vercel/next.js/issues/9992#issuecomment-873225898
   */
  const key = router.asPath

  return (
    <>
      <Head>
        <title>Kanbad</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>
      <PageHeader workspaces={workspaces} />
      <Component key={key} addWorkspace={addWorkspace} {...pageProps} />
    </>
  )
}
