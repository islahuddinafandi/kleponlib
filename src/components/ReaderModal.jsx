import styles from './Modal.module.css'

export default function ReaderModal({ book, onClose }) {
  const fileUrl = book.file_url

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.readerModal}>
        <div className={styles.readerHeader}>
          <div>
            <div className={styles.readerTitle}>{book.title}</div>
            {book.author && <div className={styles.readerAuthor}>{book.author}</div>}
          </div>
          <div className={styles.readerActions}>
            <a href={fileUrl} download target="_blank" rel="noreferrer">
              <button className={styles.readerActionBtn}>⬇ Unduh</button>
            </a>
            <button className={styles.readerActionBtn} onClick={onClose}>✕ Tutup</button>
          </div>
        </div>
        <iframe
          className={styles.readerFrame}
          src={fileUrl}
          title={book.title}
        />
      </div>
    </div>
  )
}