import { supabase } from './supabase'

// ─── Upload PDF ke Supabase Storage ───────────────────────────────────────

export async function uploadBookFile(file) {
  const { data: { user } } = await supabase.auth.getUser()
  const ext = file.name.split('.').pop()
  const path = `${user.id}/${Date.now()}.${ext}`

  console.log('Uploading to path:', path)

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('books')
    .upload(path, file, { upsert: false })
  
  console.log('Upload result:', uploadData, uploadError)

  if (uploadError) throw uploadError

  const { data } = supabase.storage.from('books').getPublicUrl(path)
  
  console.log('Public URL:', data.publicUrl)
  
  return { path, url: data.publicUrl }
}

// ─── Supabase: Metadata Buku ───────────────────────────────────────────────

export async function getBooks({ search = '', genre = '', sort = 'created_at' } = {}) {
  let query = supabase
    .from('books')
    .select('*')
    .order(sort, { ascending: sort === 'title' || sort === 'author' })

  if (search) query = query.or(`title.ilike.%${search}%,author.ilike.%${search}%`)
  if (genre)  query = query.eq('genre', genre)

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function addBook(book) {
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from('books')
    .insert([{ ...book, user_id: user.id }])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteBook(id) {
  const { error } = await supabase.from('books').delete().eq('id', id)
  if (error) throw error
}

export async function getGenres() {
  const { data, error } = await supabase.from('books').select('genre')
  if (error) throw error
  return [...new Set(data.map(b => b.genre).filter(Boolean))].sort()
}

// ─── Cover ────────────────────────────────────────────────────────────────

export function getCoverUrl(book) {
  if (book.cover_url) return book.cover_url
  if (book.isbn) return `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`
  return null
}