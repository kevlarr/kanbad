import Link from 'next/link'

import { Heading } from '@/components/base'
import css from './PageHeader.module.css'

interface PageHeaderProps {
  workspaces: Array<string>,
}

export default function PageHeader({ workspaces }: PageHeaderProps) {
  return (
    <div className={css.pageHeader}>
      <Link className={css.logotype} href='/'>
        <Heading inline level={1}>kanbad</Heading>
      </Link>
      <ul>
        {workspaces.map((uuid) =>
          <li key={uuid}>
            <Link href={`/workspaces/${uuid}`}>{uuid}</Link>
          </li>
        )}
      </ul>
    </div>
  )
}
