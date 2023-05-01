import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import api from '@/lib/api'
import { WorkspaceModel } from '@/lib/models'
import Workspace from '@/components/Workspace/Workspace'

// TODO: Use getServerSideProps and set API URL once CORS issue with
// local server has been fixed
export async function getServerSideProps(context) {
    const { uuid } = context.query
    const workspace =  await api.get(`workspaces/${uuid}`)

    return {
        props: { workspace }
    }
}

export default function WorkspacePage({ workspace }: { workspace: WorkspaceModel}) {
    return <Workspace workspace={workspace} />
}
