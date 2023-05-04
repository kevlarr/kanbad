import Link from 'next/link'
import css from './AppHeader.module.css'

export default function AppHeader() {
  return (
    <header className={css.header}>
      <Link href='/'>
        <h1 className={css.title}>Kanbad</h1>
      </Link>
    </header>
  )
}
