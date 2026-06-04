import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { Link } from 'react-router-dom'

export default function Library() {
  const [books, setBooks] = useState([])
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    const { data, error } = await supabase.from('books').select('*')
    if (error) console.error('Error fetching books:', error)
    else setBooks(data)
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    const form = e.target
    const title = form.title.value
    const author = form.author.value
    const file = form.file.files[0]
    
    if (!file) return alert('Pilih file dulu!')
    setUploading(true)

    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    
    // 1. Upload ke Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('library-files')
      .upload(fileName, file)

    if (uploadError) {
      alert(uploadError.message)
      setUploading(false)
      return
    }

    // Dapatkan URL Publik
    const { data: { publicUrl } } = supabase.storage
      .from('library-files')
      .getPublicUrl(fileName)

    // 2. Simpan ke Database
    const { error: dbError } = await supabase.from('books').insert([
      { title, author, file_type: fileExt, file_url: publicUrl }
    ])

    if (dbError) alert(dbError.message)
    else {
      alert('Buku berhasil ditambahkan!')
      form.reset()
      fetchBooks()
    }
    setUploading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>Library Ku</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ccc' }}>
        <h3>Tambah Buku Baru</h3>
        <form onSubmit={handleUpload} style={{ display: 'flex', gap: '10px' }}>
          <input name="title" placeholder="Judul Buku" required />
          <input name="author" placeholder="Penulis" required />
          <input name="file" type="file" accept=".pdf,.epub" required />
          <button type="submit" disabled={uploading}>
            {uploading ? 'Mengunggah...' : 'Upload'}
          </button>
        </form>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
        {books.map((book) => (
          <div key={book.id} style={{ border: '1px solid #ddd', padding: '15px' }}>
            <h4>{book.title}</h4>
            <p><small>{book.author} | {book.file_type.toUpperCase()}</small></p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <Link to={`/read/${book.id}`} style={{ textDecoration: 'none', color: 'blue' }}>Baca</Link>
              <a href={book.file_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'green' }} download>Download</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
