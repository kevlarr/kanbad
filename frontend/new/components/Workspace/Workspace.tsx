import { WorkspaceModel } from '@/lib/models'
import css from './Workspace.module.css'



export default function Workspace({ workspace }: { workspace: WorkspaceModel}) {
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