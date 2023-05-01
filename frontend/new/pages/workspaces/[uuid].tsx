import { GetServerSideProps } from 'next'

import api from '@/lib/api'
import { BoardModel, CardModel, WorkspaceModel } from '@/lib/models'
import css from './uuid.module.css'

export const getServerSideProps: GetServerSideProps = async (context) => {
    // TODO: Proper way to `type` context & uuid, etc?
    const { uuid } = context.query
    const [boards, cards, workspace] = await Promise.all([
        api.get(`boards?workspace=${uuid}`),
        api.get(`cards?workspace=${uuid}`),
        api.get(`workspaces/${uuid}`),
    ])

    return {
        props: {
            boards,
            cards,
            workspace,
        }
    }
}

interface IParams {
    boards: Array<BoardModel>,
    cards: Array<CardModel>,
    workspace: WorkspaceModel,
}

export default function WorkspacePage({ boards, cards, workspace }: IParams) {
    return (
        <div className={css.workspace}>
            <div className={css.meta}>
                <button className={css.addBoard}>+ Add Board</button>
                <h2 className={css.identifier}>{workspace.identifier}</h2>
                <p className={css.disclaimer}>
                    Make sure to <strong><span className={css.star}>★</span>bookmark</strong> this page.
                    While we won't lose the workspace, losing the address means you probably will.
                </p>
            </div>
            TODO: boards
        </div>
    )
}
