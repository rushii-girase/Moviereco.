import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchUserLists, createCustomList, deleteCustomList } from '../api/backend';
import type { CustomListData } from '../api/backend';
import { List, Plus, Trash2, Share2, Check } from 'lucide-react';

export const CustomListsPage: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const [lists, setLists] = useState<CustomListData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isLoggedIn) {
      loadLists();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn]);

  const loadLists = async () => {
    try {
      const data = await fetchUserLists();
      setLists(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await createCustomList(newName, newDesc, isPublic);
      setNewName('');
      setNewDesc('');
      setIsPublic(false);
      setShowCreate(false);
      loadLists();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (listId: number) => {
    if (!window.confirm('Delete this list? This cannot be undone.')) return;
    try {
      await deleteCustomList(listId);
      loadLists();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyShareLink = (shareCode: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/shared-list/${shareCode}`);
    setCopiedCode(shareCode);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (!isLoggedIn) {
    return (
      <div style={{ maxWidth: 'var(--layout-max-width)', margin: '0 auto', padding: 'var(--space-10)', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-10)' }}>
          My Lists
        </h1>
        <p style={{ color: 'var(--color-text-primary)', marginBottom: 'var(--space-10)' }}>
          Sign in to create and manage custom movie lists.
        </p>
        <a
          href="/login"
          style={{
            display: 'inline-block',
            backgroundColor: 'var(--color-text-inverse)',
            color: 'var(--color-surface-base)',
            padding: '10px 24px',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 600,
          }}
        >
          Sign In
        </a>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: 'var(--color-surface-muted)',
    border: '1px solid var(--color-border-subtle)',
    borderRadius: 'var(--radius-sm)',
    padding: 'var(--space-6) var(--space-8)',
    color: 'var(--color-text-secondary)',
    fontSize: 'var(--font-size-base)',
  };

  return (
    <div style={{ maxWidth: 'var(--layout-max-width)', margin: '0 auto', padding: 'var(--space-10)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-13)' }}>
        <h1 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <List size={28} color="var(--color-text-inverse)" /> My Lists
        </h1>
        <button
          onClick={() => setShowCreate(!showCreate)}
          style={{
            backgroundColor: 'var(--color-text-inverse)',
            color: 'var(--color-surface-base)',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            padding: 'var(--space-6) var(--space-10)',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}
        >
          <Plus size={16} /> New List
        </button>
      </div>

      {/* Create Form */}
      {showCreate && (
        <div style={{
          backgroundColor: 'var(--color-surface-raised)',
          border: '1px solid var(--color-border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-10)',
          marginBottom: 'var(--space-10)',
        }}>
          <h3 style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-8)' }}>Create New List</h3>
          {error && (
            <div style={{ color: 'var(--color-state-error)', marginBottom: 'var(--space-6)', fontSize: 'var(--font-size-sm)' }}>
              {error}
            </div>
          )}
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
            <input
              type="text" required placeholder="List name (e.g., Weekend Watch)"
              value={newName} onChange={(e) => setNewName(e.target.value)}
              style={inputStyle}
            />
            <textarea
              placeholder="Description (optional)"
              value={newDesc} onChange={(e) => setNewDesc(e.target.value)}
              rows={2}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-primary)', fontSize: 'var(--font-size-sm)', cursor: 'pointer' }}>
              <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
              Make this list public (shareable via link)
            </label>
            <button type="submit" style={{
              backgroundColor: 'var(--color-text-inverse)', color: 'var(--color-surface-base)',
              border: 'none', borderRadius: 'var(--radius-sm)', padding: '10px',
              fontWeight: 600, cursor: 'pointer',
            }}>
              Create List
            </button>
          </form>
        </div>
      )}

      {/* Lists Grid */}
      {loading ? (
        <p style={{ color: 'var(--color-text-tertiary)', textAlign: 'center', padding: '48px 0' }}>Loading lists…</p>
      ) : lists.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <p style={{ color: 'var(--color-text-primary)', marginBottom: 'var(--space-6)' }}>No lists yet.</p>
          <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--font-size-sm)' }}>
            Create your first list to organize movies by mood, genre, or occasion.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-10)' }}>
          {lists.map((list) => (
            <div
              key={list.id}
              style={{
                backgroundColor: 'var(--color-surface-raised)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-10)',
                display: 'flex', flexDirection: 'column', gap: 'var(--space-6)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-text-secondary)' }}>{list.name}</h3>
                  {list.description && (
                    <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)', marginTop: '2px' }}>{list.description}</p>
                  )}
                </div>
                <button onClick={() => handleDelete(list.id)} style={{
                  background: 'none', border: 'none', color: 'var(--color-text-tertiary)',
                  cursor: 'pointer', padding: '4px',
                }}>
                  <Trash2 size={16} />
                </button>
              </div>

              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>
                {list.items?.length || 0} items
              </div>

              {/* Poster Strip */}
              {list.items && list.items.length > 0 && (
                <div style={{ display: 'flex', gap: '4px', overflow: 'hidden' }}>
                  {list.items.slice(0, 5).map((item) => (
                    <img
                      key={item.tmdbId}
                      src={item.posterPath ? `https://image.tmdb.org/t/p/w92${item.posterPath}` : ''}
                      alt={item.title}
                      style={{ width: '50px', height: '75px', borderRadius: 'var(--radius-xs)', objectFit: 'cover' }}
                    />
                  ))}
                </div>
              )}

              {list.isPublic && (
                <button
                  onClick={() => handleCopyShareLink(list.shareCode)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    backgroundColor: 'transparent',
                    border: '1px solid var(--color-border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: 'var(--space-4) var(--space-6)',
                    color: copiedCode === list.shareCode ? 'var(--color-state-success)' : 'var(--color-text-primary)',
                    cursor: 'pointer', fontSize: 'var(--font-size-xs)',
                  }}
                >
                  {copiedCode === list.shareCode ? <Check size={14} /> : <Share2 size={14} />}
                  {copiedCode === list.shareCode ? 'Link copied!' : 'Share List'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
