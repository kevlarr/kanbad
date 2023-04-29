import Link from 'next/link'
import css from './Header.module.css'

export default function Header() {
    return (
        <header className={css.header}>
            <Link href='/'>
                <h1 className={css.title}>treclo</h1>
            </Link>
        </header>
    )
}