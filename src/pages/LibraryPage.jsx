import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../lib/AuthContext'
import { getBooks, getGenres, deleteBook, addBook, getCoverUrl, getGDriveViewUrl, getGDriveEmbedUrl } from '../lib/books'
import BookCard from '../components/BookCard'
import AddBookModal from '../components/AddBookModal'
import ReaderModal from '../components/ReaderModal'
import styles from './LibraryPage.module.css'

export default function LibraryPage() {
  const { user, signOut } = useAuth()
  const [books, setBooks] = useState([])
  const [genres, setGenres] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('')
  const [sort, setSort] = useState('created_at')
  const [showAddModal, setShowAddModal] = useState(false)
  const [readerBook, setReaderBook] = useState(null)
  const [error, setError] = useState('')

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getBooks({ search, genre: selectedGenre, sort })
      setBooks(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [search, selectedGenre, sort])

  useEffect(() => {
    fetchBooks()
  }, [fetchBooks])

  useEffect(() => {
    getGenres().then(setGenres).catch(console.error)
  }, [books])

  async function handleDelete(id) {
    if (!confirm('Yakin ingin menghapus buku ini?')) return
    await deleteBook(id)
    fetchBooks()
  }

  async function handleAdd(book) {
    await addBook(book)
    setShowAddModal(false)
    fetchBooks()
  }

  const greetingName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Pembaca'

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.headerLogo}>📚</span>
          <div>
            <h1 className={styles.headerTitle}>Perpustakaan Saya</h1>
            <p className={styles.headerSub}>Selamat datang, {greetingName}</p>
          </div>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.addBtn} onClick={() => setShowAddModal(true)}>
            + Tambah Buku
          </button>
          <button className={styles.logoutBtn} onClick={signOut} title="Keluar">
            ↩ Keluar
          </button>
        </div>
      </header>

      {/* Filter & Search */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Cari judul atau penulis..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className={styles.clearBtn} onClick={() => setSearch('')}>✕</button>
          )}
        </div>

        <select
          className={styles.select}
          value={selectedGenre}
          onChange={e => setSelectedGenre(e.target.value)}
        >
          <option value="">Semua Genre</option>
          {genres.map(g => <option key={g} value={g}>{g}</option>)}
        </select>

        <select
          className={styles.select}
          value={sort}
          onChange={e => setSort(e.target.value)}
        >
          <option value="created_at">Terbaru</option>
          <option value="title">Judul A–Z</option>
          <option value="author">Penulis A–Z</option>
          <option value="year">Tahun</option>
        </select>
      </div>

      {/* Stats bar */}
      <div className={styles.statsBar}>
        <span>{books.length} buku ditemukan</span>
        {selectedGenre && <span className={styles.filterTag}>{selectedGenre} ✕</span>}
      </div>

      {/* Error */}
      {error && (
        <div className={styles.errorBox}>
          ⚠️ {error}
          <button onClick={() => setError('')}>✕</button>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className={styles.loadingGrid}>
          {[...Array(8)].map((_, i) => (
            <div key={i} className={styles.skeleton} />
          ))}
        </div>
      ) : books.length === 0 ? (
        <div className={styles.empty}>
          <span>📭</span>
          <p>Belum ada buku. <button onClick={() => setShowAddModal(true)}>Tambah sekarang</button></p>
        </div>
      ) : (
        <div className={styles.grid}>
          {books.map(book => (
            <BookCard
              key={book.id}
              book={book}
              onRead={() => setReaderBook(book)}
              onDelete={() => handleDelete(book.id)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {showAddModal && (
        <AddBookModal onClose={() => setShowAddModal(false)} onSave={handleAdd} />
      )}
      {readerBook && (
        <ReaderModal book={readerBook} onClose={() => setReaderBook(null)} />
      )}
    </div>
  )
}
