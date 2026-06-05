import { useState } from 'react'
import styles from './Modal.module.css'

const INITIAL = {
  title: '', author: '', year: '', genre: '',
  description: '', gdrive_file_id: '', cover_url: '', isbn: ''
}

export default function AddBookModal({ onClose, onSave }) {
  const [form, setForm] = useState(INITIAL)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function set(key, val) {
    setForm(f => ({ ...f, [key]: val }))
  }

  async function handleSave() {
    if (!form.title.trim()) { setError('Judul wajib diisi'); return }
    setSaving(true)
    try {
      await onSave({ ...form, year: form.year ? parseInt(form.year) : null })
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Tambah Buku Baru</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.modalBody}>
          {error && <div className={styles.errorBox}>{error}</div>}

          <div className={styles.grid2}>
            <Field label="Judul *" value={form.title} onChange={v => set('title', v)} placeholder="Judul buku" />
            <Field label="Penulis" value={form.author} onChange={v => set('author', v)} placeholder="Nama penulis" />
          </div>
          <div className={styles.grid2}>
            <Field label="Tahun Terbit" value={form.year} onChange={v => set('year', v)} placeholder="2024" type="number" />
            <Field label="Genre" value={form.genre} onChange={v => set('genre', v)} placeholder="Fiksi, Sains, dll." />
          </div>
          <Field
            label="Google Drive File ID"
            value={form.gdrive_file_id}
            onChange={v => set('gdrive_file_id', v)}
            placeholder="Ambil dari URL: drive.google.com/file/d/[ID]/view"
          />
          <Field
            label="URL Cover (opsional)"
            value={form.cover_url}
            onChange={v => set('cover_url', v)}
            placeholder="https://..."
          />
          <Field
            label="ISBN (opsional — untuk cover otomatis)"
            value={form.isbn}
            onChange={v => set('isbn', v)}
            placeholder="9780000000000"
          />
          <div className={styles.field}>
            <label>Deskripsi</label>
            <textarea
              className={styles.textarea}
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Sinopsis singkat..."
              rows={3}
            />
          </div>

          <div className={styles.hint}>
            💡 <strong>Cara mendapat File ID:</strong> Buka file di Google Drive → klik kanan → 
            Bagikan → siapapun yang punya link bisa melihat → salin ID dari URL.
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.cancelBtn} onClick={onClose}>Batal</button>
          <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
            {saving ? 'Menyimpan...' : '💾 Simpan Buku'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div className={styles.field}>
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  )
}
