import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Plus,
  Search,
  MessageSquare,
  Edit2,
  Trash2,
  Check,
  X,
  Settings,
  LogOut,
  LogIn,
  Sun,
  Moon,
  PanelLeftClose,
} from 'lucide-react';

export default function Sidebar({
  isOpen,
  onClose,
  onOpenAuth,
  onOpenSettings,
}) {
  const {
    conversations,
    activeId,
    selectConversation,
    startNewChat,
    renameConversation,
    deleteConversation,
    searchQuery,
    setSearchQuery,
    loadingList,
  } = useChat();

  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');

  const handleStartRename = (conv, e) => {
    e.stopPropagation();
    setEditingId(conv._id || conv.id);
    setEditingTitle(conv.title);
  };

  const handleSaveRename = (convId, e) => {
    e.stopPropagation();
    if (editingTitle.trim()) {
      renameConversation(convId, editingTitle.trim());
    }
    setEditingId(null);
  };

  const handleCancelRename = (e) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const handleDelete = (convId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      deleteConversation(convId);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}

      <aside className={`sidebar-container ${isOpen ? 'open' : 'closed'}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <button
            className="new-chat-btn"
            onClick={() => {
              startNewChat();
              if (window.innerWidth < 768) onClose();
            }}
          >
            <div className="new-chat-content">
              <Plus size={18} />
              <span>New Chat</span>
            </div>
            <span className="shortcut-badge">Ctrl+K</span>
          </button>

          <button
            className="sidebar-close-toggle"
            onClick={onClose}
            title="Close sidebar"
            aria-label="Close sidebar"
          >
            <PanelLeftClose size={18} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="sidebar-search-box">
          <Search size={15} className="search-icon" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="sidebar-search-input"
          />
          {searchQuery && (
            <button
              className="clear-search-btn"
              onClick={() => setSearchQuery('')}
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* History List */}
        <div className="sidebar-history-container">
          <div className="history-section-title">
            <span>Recent Chats</span>
            {conversations.length > 0 && (
              <span className="count-pill">{conversations.length}</span>
            )}
          </div>

          {loadingList ? (
            <div className="sidebar-loading">
              <div className="skeleton-item" />
              <div className="skeleton-item" />
              <div className="skeleton-item" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="sidebar-empty">
              <MessageSquare size={24} className="empty-icon" />
              <p>
                {searchQuery
                  ? 'No matching conversations'
                  : 'No previous conversations yet.'}
              </p>
            </div>
          ) : (
            <ul className="conversations-list">
              {conversations.map((conv) => {
                const convId = conv._id || conv.id;
                const isActive = activeId === convId;
                const isEditing = editingId === convId;

                return (
                  <li
                    key={convId}
                    className={`conversation-item ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      if (!isEditing) {
                        selectConversation(convId);
                        if (window.innerWidth < 768) onClose();
                      }
                    }}
                  >
                    <MessageSquare size={16} className="conv-icon" />

                    {isEditing ? (
                      <div className="inline-rename-form">
                        <input
                          type="text"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveRename(convId, e);
                            if (e.key === 'Escape') handleCancelRename(e);
                          }}
                        />
                        <button
                          className="action-save-btn"
                          onClick={(e) => handleSaveRename(convId, e)}
                        >
                          <Check size={14} />
                        </button>
                        <button
                          className="action-cancel-btn"
                          onClick={handleCancelRename}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="conv-title" title={conv.title}>
                          {conv.title || 'Untitled Chat'}
                        </span>

                        <div className="conv-hover-actions">
                          <button
                            className="conv-action-btn"
                            title="Rename"
                            onClick={(e) => handleStartRename(conv, e)}
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            className="conv-action-btn delete"
                            title="Delete"
                            onClick={(e) => handleDelete(convId, e)}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* User Profile & Footer Area */}
        <div className="sidebar-footer">
          {isAuthenticated ? (
            <div className="user-profile-widget">
              <div className="user-avatar-circle">
                {getInitials(user?.name)}
              </div>
              <div className="user-info-text">
                <span className="user-name">{user?.name}</span>
                <span className="user-email">{user?.email}</span>
              </div>
              <div className="footer-actions">
                <button
                  className="footer-btn"
                  onClick={onOpenSettings}
                  title="Settings & Export"
                >
                  <Settings size={17} />
                </button>
                <button
                  className="footer-btn logout"
                  onClick={logout}
                  title="Sign Out"
                >
                  <LogOut size={17} />
                </button>
              </div>
            </div>
          ) : (
            <div className="guest-footer">
              <button className="auth-prompt-btn" onClick={onOpenAuth}>
                <LogIn size={17} />
                <span>Sign In / Register</span>
              </button>
              <button
                className="footer-btn"
                onClick={toggleTheme}
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
