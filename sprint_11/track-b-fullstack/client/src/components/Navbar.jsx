import React from 'react';
import { Database, PlusCircle, Search, Layers, Radio, Sparkles } from 'lucide-react';

export default function Navbar({
  serverStatus,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  onCreateClick,
  categories = ['All', 'Fullstack', 'Frontend', 'Backend', 'Architecture', 'Testing']
}) {
  return (
    <header className="header-glass">
      <div className="container" style={{ padding: '16px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          
          {/* Logo & Status Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
                }}
              >
                <Database size={22} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="brand-font" style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff' }}>
                    DATA HUB
                  </span>
                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '999px', background: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc', fontWeight: '700', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                    MERN SPRINT 11
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  <span className={serverStatus.online ? 'pulse-online' : 'pulse-offline'} />
                  <span>
                    {serverStatus.online ? `API Online (${serverStatus.db || 'Active'})` : 'API Disconnected'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar Input */}
          <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: '360px' }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }}
            />
            <input
              type="text"
              placeholder="Search posts, architecture, topics..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px 10px 38px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(17, 24, 39, 0.9)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                outline: 'none',
                transition: 'border 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
            />
          </div>

          {/* New Post CTA Button */}
          <button
            type="button"
            onClick={onCreateClick}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
              color: '#ffffff',
              border: 'none',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
              transition: 'transform 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <PlusCircle size={18} />
            <span>Publish Post</span>
          </button>
        </div>

        {/* Category Pills Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '16px',
            overflowX: 'auto',
            paddingBottom: '4px'
          }}
        >
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginRight: '4px' }}>
            <Layers size={14} /> Filter:
          </span>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onCategoryChange(cat)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '12px',
                  fontWeight: isActive ? '700' : '500',
                  border: isActive ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                  background: isActive ? 'var(--primary-light)' : 'rgba(17, 24, 39, 0.6)',
                  color: isActive ? '#a5b4fc' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
