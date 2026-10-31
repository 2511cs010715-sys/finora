import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useChat } from '../context/ChatContext';
import { X, Moon, Sun, Download, Trash2, ShieldCheck } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose }) {
  const { theme, toggleTheme } = useTheme();
  const { activeConversation, exportConversation, startNewChat } = useChat();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="settings-modal-header">
          <h3>Settings & Preferences</h3>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="settings-modal-body">
          {/* Appearance Section */}
          <div className="settings-section">
            <h4>Appearance</h4>
            <div className="settings-row">
              <div className="settings-info">
                <span className="settings-label">Color Theme</span>
                <span className="settings-desc">Switch between sleek Dark and crisp Light UI</span>
              </div>
              <button className="theme-toggle-btn" onClick={toggleTheme}>
                {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
                <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
              </button>
            </div>
          </div>

          {/* Conversation Actions */}
          <div className="settings-section">
            <h4>Active Conversation</h4>
            <div className="settings-row">
              <div className="settings-info">
                <span className="settings-label">Export Chat</span>
                <span className="settings-desc">Download this conversation to your local drive</span>
              </div>
              <div className="export-buttons-group">
                <button
                  className="btn-outline-sm"
                  onClick={() => exportConversation('markdown')}
                  disabled={!activeConversation}
                >
                  <Download size={14} />
                  <span>.MD</span>
                </button>
                <button
                  className="btn-outline-sm"
                  onClick={() => exportConversation('json')}
                  disabled={!activeConversation}
                >
                  <Download size={14} />
                  <span>.JSON</span>
                </button>
                <button
                  className="btn-outline-sm"
                  onClick={() => exportConversation('text')}
                  disabled={!activeConversation}
                >
                  <Download size={14} />
                  <span>.TXT</span>
                </button>
              </div>
            </div>

            <div className="settings-row">
              <div className="settings-info">
                <span className="settings-label">Reset / New Chat</span>
                <span className="settings-desc">Clear current view and begin a fresh thread</span>
              </div>
              <button
                className="btn-danger-sm"
                onClick={() => {
                  startNewChat();
                  onClose();
                }}
              >
                <Trash2 size={14} />
                <span>New Session</span>
              </button>
            </div>
          </div>

          {/* Security & AI Provider info */}
          <div className="settings-section">
            <h4>Security & AI Service</h4>
            <div className="settings-badge-card">
              <ShieldCheck size={20} className="security-icon" />
              <div>
                <div className="badge-card-title">Zero API Key Leaks</div>
                <p className="badge-card-desc">
                  All AI completions and database operations run securely via the Node.js Express backend. No keys are exposed in client bundle.
                </p>
              </div>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="settings-section">
            <h4>Keyboard Shortcuts</h4>
            <div className="shortcuts-list">
              <div className="shortcut-item">
                <span>Send Message</span>
                <kbd>Enter</kbd>
              </div>
              <div className="shortcut-item">
                <span>New Line</span>
                <kbd>Shift + Enter</kbd>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
