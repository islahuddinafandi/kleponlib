import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { ReactReader } from 'react-reader'

export default function ReadBook() {
  const { id } = useParams()
  const [book, setBook] = useState(null)
  const [location, setLocation] = useState(null)

  useEffect(() => {
    const fetchBook = async () => {
      const { data, error } = await supabase.from('books').select('*').eq('id', id).single()
      if (data) setBook(data)
      if (error) console.error(error)
    }
    fetchBook()
  }, [id])

  if (!book) return <p>Loading book...</p>

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '10px', backgroundColor: '#f0f0f0' }}>
        <Link to="/">&larr; Kembali ke Library</Link>
        <span style={{ marginLeft: '20px', fontWeight: 'bold' }}>Membaca: {book.title}</span>
      </div>

      <div style={{ flex: 1, position: 'relative' }}>
        {book.file_type === 'pdf' ? (
          <iframe 
            src={book.file_url} 
            width="100%" 
            height="100%" 
            title={book.title}
            style={{ border: 'none' }}
          ></iframe>
        ) : book.file_type === 'epub' ? (
          <ReactReader
            url={book.file_url}
            title={book.title}
            location={location}
            locationChanged={(epubcfi) => setLocation(epubcfi)}
          />
        ) : (
          <p>Format tidak didukung</p>
        )}
      </div>
    </div>
  )
}
