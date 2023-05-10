import Link from 'next/link'

import { Heading } from '@/components/base'
import css from './PageHeader.module.css'

export default function PageHeader() {
  return (
    <div className={css.pageHeader}>
      <Link className={css.logotype} href='/'>
        <Heading inline level={1}>kanbad</Heading>
      </Link>
    </div>
  )
}
