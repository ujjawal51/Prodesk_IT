import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import PostCard from './components/PostCard';
import CreatePostModal from './components/CreatePostModal';
import EditPostModal from './components/EditPostModal';
import LoadingSkeleton from './components/LoadingSkeleton';
import ErrorBoundary from './components/ErrorBoundary';
import { getPosts, createPost, updatePost, deletePost, likePost, checkServerHealth } from './services/api';
import { PlusCircle, Database, Server, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [serverStatus, setServerStatus] = useState({ online: false, db: 'Checking...' });
  const [deletingIds, setDeletingIds] = useState(new Set());

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  // Notification Toast State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  /**
   * Check Server Status and CORS Availability
   */
  const verifyBackend = useCallback(async () => {
    try {
      const health = await checkServerHealth();
      setServerStatus({ online: true, db: health.database || 'Online' });
    } catch {
      setServerStatus({ online: false, db: 'Offline' });
    }
  }, []);

  /**
   * Phase 1: Data Fetching
   * Utilize useEffect to execute GET requests to your database and render the payloads.
   */
  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await verifyBackend();
      const response = await getPosts({
        search: searchQuery || undefined,
        category: selectedCategory !== 'All' ? selectedCategory : undefined
      });
      setPosts(response.data || []);
    } catch (err) {
      console.error('[loadPosts Error]', err);
      setError(err.response?.data?.error || err.message || 'Failed to fetch data from backend');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory, verifyBackend]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  /**
   * Phase 2: Data Injection (POST)
   * Dispatches POST request to backend with Multipart FormData, injecting new documents into MongoDB.
   */
  const handleCreatePost = async (formData) => {
    const response = await createPost(formData);
    const newPost = response.data;
    // Mutate local DOM immediately
    setPosts(prev => [newPost, ...prev]);
    showToast('Document injected into MongoDB with Cloud CDN asset!', 'success');
  };

  /**
   * Update Post (PUT)
   */
  const handleUpdatePost = async (id, payload) => {
    const response = await updatePost(id, payload);
    const updated = response.data;
    setPosts(prev => prev.map(p => (p._id === id ? updated : p)));
    showToast('Article successfully updated!', 'success');
  };

  /**
   * Phase 2: Data Deletion
   * Implement a "Delete" action on the UI that dispatches a DELETE request to the server
   * and subsequently mutates the local DOM to reflect the removed object.
   */
  const handleDeletePost = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document from MongoDB?')) {
      return;
    }

    // Mark as deleting
    setDeletingIds(prev => new Set(prev).add(id));

    try {
      await deletePost(id);
      // Mutate local DOM to reflect the removed object
      setPosts(prev => prev.filter(p => p._id !== id));
      showToast('Document successfully deleted from MongoDB.', 'info');
    } catch (err) {
      console.error('[Delete Error]', err);
      showToast(err.response?.data?.error || 'Failed to delete document from database', 'error');
    } finally {
      setDeletingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  /**
   * Interactive Like Mutation
   */
  const handleLikePost = async (id) => {
    // Optimistic DOM mutation
    setPosts(prev =>
      prev.map(p => (p._id === id ? { ...p, likes: (p.likes || 0) + 1 } : p))
    );

    try {
      await likePost(id);
    } catch (err) {
      console.error('[Like Sync Error]', err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Toast Notification */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 150,
            background: toast.type === 'error' ? '#7f1d1d' : toast.type === 'info' ? '#1e3a8a' : '#064e3b',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '14px',
            fontWeight: '600',
            animation: 'modal-enter 0.2s ease-out'
          }}
        >
          {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Navigation & Header */}
      <Navbar
        serverStatus={serverStatus}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        onCreateClick={() => setIsCreateOpen(true)}
      />

      {/* Main Content Area */}
      <main className="container" style={{ flex: 1, padding: '36px 24px' }}>
        {/* Banner Section */}
        <div
          style={{
            marginBottom: '36px',
            padding: '28px',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: '800', color: '#67e8f9', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                System Integration Hub
              </span>
              <span style={{ fontSize: '11px', background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee', padding: '2px 8px', borderRadius: '4px' }}>
                P0 + P1 + P2 Complete
              </span>
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#ffffff', marginBottom: '8px' }}>
              MERN Stack Architecture & QA Integration
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '720px', lineHeight: '1.6' }}>
              Bridging the gap between React/Vite SPA and Node.js/MongoDB REST API. Featuring real-time CORS authorization, dynamic loading states, optimistic DOM deletion, and Multer multipart streaming to Cloudinary CDN.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              type="button"
              onClick={loadPosts}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                background: 'rgba(17, 24, 39, 0.8)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600'
              }}
              title="Refresh dataset from MongoDB"
            >
              <RefreshCw size={15} /> Refresh
            </button>

            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                background: 'var(--primary)',
                color: '#ffffff',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
              }}
            >
              <PlusCircle size={16} /> New Article
            </button>
          </div>
        </div>

        {/* Phase 2: Error Boundary & Failure Handling */}
        <ErrorBoundary backendError={error} onRetry={loadPosts}>
          {/* Phase 2: Dynamic "Loading..." UI States */}
          {loading ? (
            <div style={{ marginTop: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                <span className="pulse-online" />
                <span>Hydrating documents from MongoDB REST API...</span>
              </div>
              <LoadingSkeleton count={6} />
            </div>
          ) : posts.length === 0 ? (
            /* Empty State */
            <div
              style={{
                padding: '64px 24px',
                textAlign: 'center',
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                border: '1px dashed var(--border-subtle)',
                maxWidth: '520px',
                margin: '40px auto'
              }}
            >
              <Server size={44} style={{ color: 'var(--text-muted)', margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff', marginBottom: '8px' }}>
                No Documents Found
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                {searchQuery || selectedCategory !== 'All'
                  ? 'No documents matched your filter criteria.'
                  : 'Your MongoDB collection is empty. Inject a new document using the button below.'}
              </p>
              <button
                type="button"
                onClick={() => setIsCreateOpen(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  background: 'var(--primary)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                <PlusCircle size={16} /> Inject First Document
              </button>
            </div>
          ) : (
            /* Hydrated Posts Grid */
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  Displaying <strong style={{ color: '#ffffff' }}>{posts.length}</strong> active document{posts.length === 1 ? '' : 's'} in MongoDB
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: '24px'
                }}
              >
                {posts.map(post => (
                  <PostCard
                    key={post._id}
                    post={post}
                    onLike={handleLikePost}
                    onEdit={setEditingPost}
                    onDelete={handleDeletePost}
                    isDeleting={deletingIds.has(post._id)}
                  />
                ))}
              </div>
            </div>
          )}
        </ErrorBoundary>
      </main>

      {/* Modals */}
      <CreatePostModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreatePost}
      />

      <EditPostModal
        isOpen={Boolean(editingPost)}
        post={editingPost}
        onClose={() => setEditingPost(null)}
        onSubmit={handleUpdatePost}
      />

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: '24px',
          textAlign: 'center',
          fontSize: '12px',
          color: 'var(--text-muted)',
          background: 'rgba(10, 14, 23, 0.9)'
        }}
      >
        <div className="container">
          <p>
            Sprint 11: The Professional Standard | Track B: Fullstack Developers (MERN System Integration)
          </p>
          <p style={{ marginTop: '4px', color: '#475569' }}>
            MongoDB • Express • React • Node • CORS • Multer MemoryStorage • Cloudinary CDN Streaming
          </p>
        </div>
      </footer>
    </div>
  );
}
