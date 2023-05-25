import Link from 'next/link'

import { WorkspaceModel } from '@/lib/models'
import { Heading } from '@/components/base'
import css from './PageHeader.module.css'

interface PageHeaderProps {
  workspaces: Array<WorkspaceModel>,
}

export default function PageHeader({ workspaces }: PageHeaderProps) {
  return (
    <div className={css.pageHeader}>
      <Link className={css.logotype} href='/'>
        <Heading inline level={1}>kanbad</Heading>
      </Link>
      <ul>
        {workspaces.map(({ identifier, title }) =>
          <li key={identifier}>
            <Link href={`/workspaces/${identifier}`}>{title}</Link>
          </li>
        )}
      </ul>
    </div>
  )
}
