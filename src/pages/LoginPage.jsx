import { useState } from 'react'
import { useAuth } from '../lib/AuthContext'
import styles from './LoginPage.module.css'

export default function LoginPage() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
      // redirect ditangani App.jsx
    } catch (err) {
      setError(err.message === 'Invalid login credentials'
        ? 'Email atau kata sandi salah.'
        : err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      {/* Dekorasi latar belakang */}
      <div className={styles.bgCircle1} />
      <div className={styles.bgCircle2} />
      <div className={styles.bgCircle3} />

      {/* Ornamen buku melayang */}
      <div className={styles.floatingBooks}>
        {['📚', '📖', '🔖', '✏️', '📝'].map((icon, i) => (
          <span key={i} className={styles.floatingIcon} style={{ '--i': i }}>{icon}</span>
        ))}
      </div>

      <div className={styles.card}>
        <div className={styles.cardTop}>
          <div className={styles.logo}>📚</div>
          <h1 className={styles.title}>Perpustakaan<br />Digital Pribadi</h1>
          <p className={styles.subtitle}>Koleksi pengetahuan Anda, satu tempat</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.errorBox}>{error}</div>}

          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="nama@email.com"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Kata Sandi</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? <span className={styles.btnSpinner} /> : 'Masuk ke Perpustakaan'}
          </button>
        </form>

        <p className={styles.hint}>
          Belum punya akun? Daftar lewat Supabase Dashboard
        </p>
      </div>
    </div>
  )
}
