import { useEffect, useState } from 'react'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { WorkspaceModel, WorkspaceParams } from '@/lib/models'
import * as storage from '@/lib/storage'
import { PageHeader } from '@/components'
import '@/styles/globals.css'
import api from '@/lib/api'


export default function App({ Component, pageProps }: AppProps) {
  const [workspaces, setWorkspaces] = useState<Array<WorkspaceModel>>([])
  const router = useRouter()

  useEffect(() => {
    const creator = storage.getUser()

    api
      .get(`workspaces?creator=${creator}`)
      .then((workspaces) => setWorkspaces(workspaces))
  }, [])

  function createWorkspace(title: string) {
    const creator = storage.getUser()
    const data = { creator, title }

    api
      .post('workspaces', data)
      .then((workspace) => {
        setWorkspaces([...workspaces, workspace])
        router.push(`workspaces/${workspace.identifier}`)
    })
  }

  async function updateWorkspace(ws: WorkspaceModel, params: WorkspaceParams) {
    return await api.patch(`workspaces/${ws.identifier}`, params)
      .then((updatedWorkspace) => {
        setWorkspaces(workspaces.map((existingWorkspace) => (
          existingWorkspace.identifier === updatedWorkspace.identifier
            ? updatedWorkspace
            : existingWorkspace
        )))
      })
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
      {/* TODO
        * How bad IS IT that this is passing `createWorkspace` and `updateWorkspace`
        * to all pages, even though each is only used on a single page?
        *
        * This also doesn't pick up typing issues...
        */}
      <Component
        key={key}
        createWorkspace={createWorkspace}
        updateWorkspace={updateWorkspace}
        {...pageProps}
      />
    </>
  )
}
