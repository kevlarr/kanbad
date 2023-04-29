import css from './Home.module.css'

export default function Home() {
    return (
        <div className={css.home}>
            <h2 className={css.welcome}>
                a
                <span className={css.hello}> hello </span>
                from treclo!
            </h2>

            <p className={css.caption}>
                Workspaces give you places to make things like boards and cards... and magic!
                Create a new one or, if you're really lucky, get a friend to share a workspace with you.
            </p>
            <div className={css.create}>
                <button className='button'>
                    Create workspace
                </button>
            </div>
        </div>
    )
}