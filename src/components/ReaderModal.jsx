import { getGDriveDownloadUrl, getGDriveViewUrl } from '../lib/books'
import styles from './Modal.module.css'

export default function ReaderModal({ book, onClose }) {
  const downloadUrl = getGDriveDownloadUrl(book.gdrive_file_id)
  const viewUrl = getGDriveViewUrl(book.gdrive_file_id)
  
  // PDF.js viewer via CDN - render langsung di browser
  const pdfJsUrl = `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(downloadUrl)}`

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.readerModal}>
        <div className={styles.readerHeader}>
          <div>
            <div className={styles.readerTitle}>{book.title}</div>
            {book.author && <div className={styles.readerAuthor}>{book.author}</div>}
          </div>
          <div className={styles.readerActions}>
            <a href={downloadUrl} target="_blank" rel="noreferrer">
              <button className={styles.readerActionBtn}>⬇ Unduh</button>
            </a>
            <a href={viewUrl} target="_blank" rel="noreferrer">
              <button className={styles.readerActionBtn}>↗ Buka Drive</button>
            </a>
            <button className={styles.readerActionBtn} onClick={onClose}>✕ Tutup</button>
          </div>
        </div>
        <iframe
          className={styles.readerFrame}
          src={pdfJsUrl}
          title={book.title}
        />
      </div>
    </div>
  )
}