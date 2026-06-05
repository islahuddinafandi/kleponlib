import { getCoverUrl } from '../lib/books'
import styles from './BookCard.module.css'

const COVER_COLORS = [
  '#c8860a', '#2d6a4f', '#1d3557', '#7b2d8b', '#c0392b',
  '#e67e22', '#16a085', '#8e44ad', '#2c3e50', '#d35400'
]

function hashColor(str) {
  let hash = 0
  for (let c of str) hash = (hash * 31 + c.charCodeAt(0)) & 0xffffffff
  return COVER_COLORS[Math.abs(hash) % COVER_COLORS.length]
}

export default function BookCard({ book, onRead, onDelete }) {
  const coverUrl = getCoverUrl(book)
  const coverBg = hashColor(book.title || 'default')

  return (
    <div className={styles.card}>
      {/* Cover */}
      <div className={styles.cover} style={{ '--cover-bg': coverBg }}>
        {coverUrl ? (
          <img src={coverUrl} alt={book.title} className={styles.coverImg} />
        ) : (
          <div className={styles.coverPlaceholder}>
            <span className={styles.coverInitial}>
              {book.title?.[0]?.toUpperCase() || '?'}
            </span>
            <span className={styles.coverTitle}>{book.title}</span>
          </div>
        )}
        {book.genre && <span className={styles.genreBadge}>{book.genre}</span>}
      </div>

      {/* Info */}
      <div className={styles.info}>
        <h3 className={styles.title}>{book.title}</h3>
        <p className={styles.author}>{book.author || 'Penulis tidak diketahui'}</p>
        {book.year && <p className={styles.year}>{book.year}</p>}
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        {book.file_url && (
          <button className={styles.readBtn} onClick={onRead}>
            📖 Baca
          </button>
        )}
        <button className={styles.deleteBtn} onClick={onDelete} title="Hapus">
          🗑
        </button>
      </div>
    </div>
  )
}
