import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ChatProvider, useChat } from './context/ChatContext';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import AuthModal from './components/AuthModal';
import SettingsModal from './components/SettingsModal';

import './styles/index.css';
import './styles/sidebar.css';
import './styles/chat.css';
import './styles/auth.css';

function MainApp() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  const { startNewChat } = useChat();

  // Keyboard shortcut listener: Ctrl+K or Cmd+K for New Chat
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        startNewChat();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [startNewChat]);

  // Window resize handler
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="app-container">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenSettings={() => setSettingsModalOpen(true)}
      />

      <ChatArea
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenSettings={() => setSettingsModalOpen(true)}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ChatProvider>
          <MainApp />
        </ChatProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
