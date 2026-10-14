import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/useAuth';
import { fetchUserLists, createCustomList, deleteCustomList } from '../api/backend';
import type { CustomListData } from '../api/backend';
import { List, Plus, Trash2, Share2, Check, Lock, Globe } from 'lucide-react';
import styles from './CustomListsPage.module.css';

export const CustomListsPage: React.FC = () => {
  const { isLoggedIn } = useAuth();

  const [lists, setLists] = useState<CustomListData[]>([]);

  const [loading, setLoading] = useState(false);

  const [showCreate, setShowCreate] = useState(false);

  const [newName, setNewName] = useState('');

  const [newDesc, setNewDesc] = useState('');

  const [isPublic, setIsPublic] = useState(false);

  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const [error, setError] = useState('');

  const loadLists = useCallback(async () => {
    try {
      const data = await fetchUserLists();

      setLists(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    let isSubscribed = true;

    fetchUserLists()
      .then((data) => {
        if (isSubscribed) {
          setLists(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isSubscribed) {
          console.error(err);
          setLoading(false);
        }
      });

    return () => {
      isSubscribed = false;
    };
  }, [isLoggedIn]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await createCustomList(newName, newDesc, isPublic);

      setNewName('');
      setNewDesc('');
      setIsPublic(false);
      setShowCreate(false);

      await loadLists();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create list';

      setError(msg);
    }
  };

  const handleDelete = async (listId: number) => {
    if (!window.confirm('Delete this collection? This action cannot be reversed.')) {
      return;
    }

    try {
      await deleteCustomList(listId);

      await loadLists();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyShareLink = (shareCode: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/shared-list/${shareCode}`);
    setCopiedCode(shareCode);

    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
  };

  if (!isLoggedIn) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyNotice}>
          <h2 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
            Personal Film Curation
          </h2>
          <p>Sign in to create, organize, and share your personal movie anthologies.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>Curated Film Anthologies</h1>
          <p className={styles.subtitle}>
            Organize personal film retrospectives, double features, and thematic collections.
          </p>
        </div>

        <button
          type="button"
          className={styles.createBtn}
          onClick={() => setShowCreate(!showCreate)}
        >
          <Plus size={16} />
          <span>New Collection</span>
        </button>
      </header>

      {showCreate && (
        <form className={styles.createModal} onSubmit={handleCreate}>
          <h2 style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-text-secondary)' }}>
            Create New Film Collection
          </h2>

          {error && (
            <p style={{ color: 'var(--color-state-error)', fontSize: 'var(--font-size-xs)' }}>
              {error}
            </p>
          )}

          <input
            type="text"
            className={styles.input}
            placeholder="Collection Title (e.g., Late Night Neo-Noirs)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
          />

          <textarea
            className={styles.input}
            placeholder="Description or curatorial statement..."
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            rows={3}
          />

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--font-size-sm)', cursor: 'pointer', color: 'var(--color-text-secondary)' }}>
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            <span>Public Collection (Generate shareable link)</span>
          </label>

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button type="submit" className={styles.createBtn}>
              Save Collection
            </button>
            <button
              type="button"
              className={styles.input}
              style={{ cursor: 'pointer' }}
              onClick={() => setShowCreate(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p style={{ color: 'var(--color-text-primary)', textAlign: 'center', padding: '48px 0' }}>
          Loading your collections...
        </p>
      ) : lists.length === 0 ? (
        <div className={styles.emptyNotice}>
          <List size={36} style={{ color: 'var(--color-text-tertiary)', marginBottom: '12px' }} />
          <h2 style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
            No Collections Yet
          </h2>
          <p>Create your first curated list to begin grouping your favorite cinema masterpieces.</p>
        </div>
      ) : (
        <div className={styles.listsGrid}>
          {lists.map((list) => (
            <div key={list.id} className={styles.listCard}>
              <div className={styles.cardTop}>
                <h3 className={styles.listName}>{list.name}</h3>

                <span className={styles.publicBadge}>
                  {list.isPublic ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Globe size={11} /> Public
                    </span>
                  ) : (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Lock size={11} /> Private
                    </span>
                  )}
                </span>
              </div>

              {list.description && (
                <p className={styles.listDesc}>{list.description}</p>
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '12px' }}>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>
                  {list.items?.length || 0} films
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {list.isPublic && (
                    <button
                      type="button"
                      className={styles.input}
                      style={{ padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                      onClick={() => handleCopyShareLink(list.shareCode)}
                      title="Copy public link"
                    >
                      {copiedCode === list.shareCode ? <Check size={14} color="var(--color-state-success)" /> : <Share2 size={14} />}
                      <span>{copiedCode === list.shareCode ? 'Copied' : 'Share'}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    className={styles.input}
                    style={{ padding: '6px 10px', cursor: 'pointer', color: 'var(--color-state-error)' }}
                    onClick={() => handleDelete(list.id)}
                    title="Delete collection"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
