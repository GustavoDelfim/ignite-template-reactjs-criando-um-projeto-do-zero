import commonStyles from '../../styles/common.module.scss';
import styles from './header.module.scss'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={commonStyles.containerCenter}>
        <img src="/logo.png" alt="Logo" />
      </div>
    </header>
  )
}
