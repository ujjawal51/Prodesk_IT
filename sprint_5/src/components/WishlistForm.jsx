import { useState } from 'react'

const GENRES = ['Rock', 'Jazz', 'Blues', 'Electronic', 'Hip-Hop', 'Classical', 'Pop', 'Folk', 'Metal', 'Soul', 'Reggae', 'Punk']

const empty = { album: '', artist: '', genre: '', note: '', priority: 'medium' }

// ek field mein error check karta hai
function validate(fields) {
  const errs = {}
  if (!fields.album.trim()) errs.album = 'Album name is required'
  if (!fields.artist.trim()) errs.artist = 'Artist name is required'
  if (!fields.genre) errs.genre = 'Please select a genre'
  return errs
}

export default function WishlistForm({ onAdd }) {
  const [fields, setFields] = useState(empty)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  function change(e) {
    const { name, value } = e.target
    setFields(prev => ({ ...prev, [name]: value }))
    // real-time error clear karo jab user type kare
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  function submit(e) {
    e.preventDefault()
    const errs = validate(fields)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    onAdd(fields)
    setFields(empty)
    setErrors({})
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 2500)
  }

  return (
    <form
      className="wl-form"
      onSubmit={submit}
      noValidate
      aria-label="Add vinyl record to wishlist"
    >
      <h2 className="wl-form-title">Add to Wishlist</h2>

      {submitted && (
        <div className="wl-success" role="status" aria-live="polite">
          ✓ Record added to wishlist!
        </div>
      )}

      <div className="wl-form-grid">
        {/* Album */}
        <div className="wl-field">
          <label htmlFor="wl-album" className="wl-label">
            Album Title <span aria-hidden="true">*</span>
          </label>
          <input
            id="wl-album"
            name="album"
            type="text"
            className={`wl-input ${errors.album ? 'wl-input--error' : ''}`}
            placeholder="e.g. Kind of Blue"
            value={fields.album}
            onChange={change}
            aria-required="true"
            aria-describedby={errors.album ? 'wl-album-err' : undefined}
            aria-invalid={!!errors.album}
            maxLength={120}
          />
          {errors.album && (
            <span id="wl-album-err" className="wl-error" role="alert">
              {errors.album}
            </span>
          )}
        </div>

        {/* Artist */}
        <div className="wl-field">
          <label htmlFor="wl-artist" className="wl-label">
            Artist <span aria-hidden="true">*</span>
          </label>
          <input
            id="wl-artist"
            name="artist"
            type="text"
            className={`wl-input ${errors.artist ? 'wl-input--error' : ''}`}
            placeholder="e.g. Miles Davis"
            value={fields.artist}
            onChange={change}
            aria-required="true"
            aria-describedby={errors.artist ? 'wl-artist-err' : undefined}
            aria-invalid={!!errors.artist}
            maxLength={100}
          />
          {errors.artist && (
            <span id="wl-artist-err" className="wl-error" role="alert">
              {errors.artist}
            </span>
          )}
        </div>

        {/* Genre */}
        <div className="wl-field">
          <label htmlFor="wl-genre" className="wl-label">
            Genre <span aria-hidden="true">*</span>
          </label>
          <select
            id="wl-genre"
            name="genre"
            className={`wl-select ${errors.genre ? 'wl-input--error' : ''}`}
            value={fields.genre}
            onChange={change}
            aria-required="true"
            aria-describedby={errors.genre ? 'wl-genre-err' : undefined}
            aria-invalid={!!errors.genre}
          >
            <option value="">Select genre…</option>
            {GENRES.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          {errors.genre && (
            <span id="wl-genre-err" className="wl-error" role="alert">
              {errors.genre}
            </span>
          )}
        </div>

        {/* Priority */}
        <div className="wl-field">
          <label htmlFor="wl-priority" className="wl-label">Priority</label>
          <select
            id="wl-priority"
            name="priority"
            className="wl-select"
            value={fields.priority}
            onChange={change}
          >
            <option value="high">🔴 High — Must have</option>
            <option value="medium">🟡 Medium — Want it</option>
            <option value="low">🟢 Low — If available</option>
          </select>
        </div>
      </div>

      {/* Staff note — full width */}
      <div className="wl-field wl-field--full">
        <label htmlFor="wl-note" className="wl-label">Staff Note</label>
        <textarea
          id="wl-note"
          name="note"
          className="wl-textarea"
          placeholder="Any customer notes, condition preference, budget range…"
          value={fields.note}
          onChange={change}
          rows={3}
          maxLength={300}
        />
      </div>

      <button type="submit" className="wl-btn-submit" id="wl-submit-btn">
        + Add to Wishlist
      </button>
    </form>
  )
}
