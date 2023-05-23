import { useEffect, useState } from 'react'
import type { AppProps } from 'next/app'
import Head from 'next/head'

import * as storage from '@/lib/storage'
import { PageHeader } from '@/components'
import '@/styles/globals.css'


export default function App({ Component, pageProps }: AppProps) {
  const [workspaces, setWorkspaces] = useState<Array<string>>([])

  useEffect(() => setWorkspaces(storage.getWorkspaces()), [])

  function addWorkspace(identifier: string) {
    storage.addWorkspace(identifier)
    setWorkspaces([...workspaces, identifier])
  }

  return (
    <>
      <Head>
        <title>Kanbad</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>
      <PageHeader workspaces={workspaces} />
      <Component {...pageProps} addWorkspace={addWorkspace} />
    </>
  )
}
