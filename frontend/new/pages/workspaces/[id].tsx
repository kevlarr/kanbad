import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import api from '@/lib/api'
import { WorkspaceModel } from '@/lib/models'
import Workspace from '@/components/Workspace/Workspace'

// TODO: Use getServerSideProps and set API URL once CORS issue with
// local server has been fixed
export default function WorkspacePage() {
    const [workspace, setWorkspace] = useState<WorkspaceModel | null>(null)
    const router = useRouter()
    const { id } = router.query

    useEffect(() => {
        if (!id) {
            return
        }

        api.get(`workspaces/${id}`)
            .then((data) => {
                setWorkspace(data)
            })
    }, [id])

    if (!workspace) {
        return <p>loading...</p>
    }

    return <Workspace workspace={workspace} />
}