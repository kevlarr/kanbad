import css from './Workspace.module.css'

interface IProps {
  identifier: string,
  createBoard(): any,
}

export default function WorkspaceHeader({ identifier, createBoard }: IProps) {
  return (
    <div className={css.header}>
      <h2 className={css.identifier}>{identifier}</h2>
      <p className={css.disclaimer}>
        Make sure to <strong><span className={css.star}>★</span>bookmark</strong> this page.
        While we won't lose the workspace, losing the address means you probably will.
      </p>
    </div>
  )
}
