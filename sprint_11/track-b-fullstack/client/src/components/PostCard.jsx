import React from 'react';
import { Heart, Trash2, Edit3, Calendar, User, Tag, ExternalLink } from 'lucide-react';

export default function PostCard({
  post,
  onLike,
  onEdit,
  onDelete,
  isDeleting
}) {
  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Recent';

  // Fallback if thumbnailUrl is absent
  const imageSrc =
    post.thumbnailUrl && post.thumbnailUrl.startsWith('http')
      ? post.thumbnailUrl
      : 'https://res.cloudinary.com/demo/image/upload/v1690000000/sprint_11/default_thumb.jpg';

  return (
    <article
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
        boxShadow: 'var(--shadow-md)',
        opacity: isDeleting ? 0.4 : 1,
        pointerEvents: isDeleting ? 'none' : 'auto',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
    >
      {/* Thumbnail Container */}
      <div style={{ position: 'relative', width: '100%', height: '190px', background: '#0f172a', overflow: 'hidden' }}>
        <img
          src={imageSrc}
          alt={post.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease'
          }}
          onError={(e) => {
            // Graceful CDN fallback if image fails
            e.target.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80';
          }}
        />

        {/* Category Pill Tag */}
        <span
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(8px)',
            color: '#818cf8',
            fontSize: '11px',
            fontWeight: '700',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}
        >
          {post.category || 'Fullstack'}
        </span>

        {/* Cloudinary CDN Indicator badge */}
        <span
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            padding: '2px 8px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(16, 185, 129, 0.85)',
            backdropFilter: 'blur(8px)',
            color: '#ffffff',
            fontSize: '10px',
            fontWeight: '700'
          }}
          title="Thumbnail streamed via Cloudinary CDN"
        >
          Cloud CDN
        </span>
      </div>

      {/* Card Content Body */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <User size={13} /> {post.author || 'Engineer'}
          </span>
          <span>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Calendar size={13} /> {formattedDate}
          </span>
        </div>

        <h3
          style={{
            fontSize: '18px',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: '8px',
            lineHeight: '1.4'
          }}
        >
          {post.title}
        </h3>

        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: '13px',
            lineHeight: '1.6',
            marginBottom: '16px',
            flex: 1,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {post.content}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
            {post.tags.map((tag, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '11px',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(30, 41, 59, 0.8)',
                  color: '#94a3b8'
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer Actions */}
        <div
          style={{
            marginTop: 'auto',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {/* Like Counter */}
          <button
            type="button"
            onClick={() => onLike(post._id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(244, 63, 94, 0.1)',
              border: '1px solid rgba(244, 63, 94, 0.2)',
              color: '#fb7185',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background 0.15s'
            }}
            title="Like this post"
          >
            <Heart size={14} fill={post.likes > 0 ? '#fb7185' : 'none'} />
            <span>{post.likes || 0}</span>
          </button>

          {/* Edit & Delete Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={() => onEdit(post)}
              style={{
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                color: '#60a5fa',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px',
                fontWeight: '500'
              }}
              title="Edit Post"
            >
              <Edit3 size={13} />
              <span>Edit</span>
            </button>

            {/* Phase 2: Data Deletion */}
            <button
              type="button"
              onClick={() => onDelete(post._id)}
              style={{
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: '#f87171',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px',
                fontWeight: '500'
              }}
              title="Delete Document from MongoDB"
            >
              <Trash2 size={13} />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
