import styles from './post-resume.module.scss'

import Link from 'next/link'
import { FiCalendar, FiUser } from "react-icons/fi";

export function PostResume() {
  return (
    <article className={styles.article}>
      <header className={styles.header}>
        <h1>
          <Link href={'/post/teste'}>
            <a href="">Como utilizar Hooks</a>
          </Link>
        </h1>
        <p> Pensando em sincronização em vez de ciclos de vida. </p>
      </header>

      <div className={styles.infos}>
        <time>
          <FiCalendar size={20} />
          <span> 15 Mar 2021 </span>
        </time>
        <address>
          <FiUser size={20} />
          <span> Jason Gennaro </span>
        </address>
      </div>
    </article>
  )
}