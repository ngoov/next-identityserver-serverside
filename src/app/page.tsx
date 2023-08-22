import styles from './page.module.css'
import Link from 'next/link';

export default function Home() {
  const loginClick = async () => {
    await fetch('/api/login');
  }
  return (
    <main className={styles.main}>
      Page <Link href='/api/login'>Login</Link>
    </main>
  )
}
