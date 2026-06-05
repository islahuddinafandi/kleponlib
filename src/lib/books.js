import { supabase } from './supabase'

// ─── Supabase: Metadata Buku ───────────────────────────────────────────────

export async function getBooks({ search = '', genre = '', sort = 'created_at' } = {}) {
  let query = supabase
    .from('books')
    .select('*')
    .order(sort, { ascending: sort === 'title' || sort === 'author' })

  if (search) {
    query = query.or(`title.ilike.%${search}%,author.ilike.%${search}%`)
  }
  if (genre) {
    query = query.eq('genre', genre)
  }

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
  const genres = [...new Set(data.map(b => b.genre).filter(Boolean))]
  return genres.sort()
}

// ─── Google Drive ─────────────────────────────────────────────────────────

export const getGDriveViewUrl     = id => `https://drive.google.com/file/d/${id}/view`
export const getGDriveEmbedUrl = id => `https://docs.google.com/viewer?url=https://drive.google.com/uc?id=${id}&embedded=true`
export const getGDriveDownloadUrl = id => `https://drive.google.com/uc?export=download&id=${id}`

// ─── Cover ────────────────────────────────────────────────────────────────

export function getCoverUrl(book) {
  if (book.cover_url) return book.cover_url
  if (book.isbn) return `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`
  return null
}
