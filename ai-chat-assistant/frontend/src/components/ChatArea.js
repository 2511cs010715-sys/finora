import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ModelSelector from './ModelSelector';
import WelcomeScreen from './WelcomeScreen';
import MessageBubble from './MessageBubble';
import PromptInput from './PromptInput';
import LoadingDots from './LoadingDots';
import {
  PanelLeft,
  Bot,
  Sun,
  Moon,
  Settings,
  Download,
  LogIn,
  AlertCircle,
} from 'lucide-react';

export default function ChatArea({
  sidebarOpen,
  onToggleSidebar,
  onOpenAuth,
  onOpenSettings,
}) {
  const {
    messages,
    activeConversation,
    isGenerating,
    errorBanner,
    setErrorBanner,
    sendMessage,
    regenerateLastResponse,
    exportConversation,
  } = useChat();

  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [inputValue, setInputValue] = useState('');
  const chatBottomRef = useRef(null);

  // Auto-scroll to bottom on message list change or when generating
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  const handleSendPrompt = (prompt) => {
    sendMessage(prompt);
  };

  const handleSelectExamplePrompt = (prompt) => {
    setInputValue(prompt);
  };

  return (
    <main className="chat-main-area">
      {/* Top Navigation Bar */}
      <header className="chat-header-bar">
        <div className="header-left">
          {!sidebarOpen && (
            <button
              className="header-icon-btn toggle-sidebar-btn"
              onClick={onToggleSidebar}
              title="Open sidebar"
              aria-label="Open sidebar"
            >
              <PanelLeft size={19} />
            </button>
          )}

          <div className="header-app-branding">
            <div className="brand-badge">
              <Bot size={20} />
            </div>
            <span className="brand-title">ChatGPT</span>
            <span className="version-pill">Assistant</span>
          </div>

          <ModelSelector />
        </div>

        <div className="header-right">
          {activeConversation && (
            <button
              className="header-icon-btn"
              onClick={() => exportConversation('markdown')}
              title="Export conversation"
            >
              <Download size={18} />
            </button>
          )}

          <button
            className="header-icon-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light mode' : 'Switch to Dark mode'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            className="header-icon-btn"
            onClick={onOpenSettings}
            title="Settings"
          >
            <Settings size={18} />
          </button>

          {!isAuthenticated && (
            <button className="header-login-btn" onClick={onOpenAuth}>
              <LogIn size={15} />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </header>

      {/* Error notification banner */}
      {errorBanner && (
        <div className="chat-alert-banner">
          <AlertCircle size={16} />
          <span>{errorBanner}</span>
          <button className="close-alert" onClick={() => setErrorBanner(null)}>
            ×
          </button>
        </div>
      )}

      {/* Main Conversation Scroll View */}
      <div className="messages-scroll-area">
        {messages.length === 0 ? (
          <WelcomeScreen onSelectPrompt={handleSelectExamplePrompt} />
        ) : (
          <div className="messages-feed">
            {messages.map((msg, index) => {
              const isLastAssistant =
                msg.role === 'assistant' &&
                (index === messages.length - 1 ||
                  (index === messages.length - 2 && isGenerating));

              return (
                <MessageBubble
                  key={msg._id || index}
                  message={msg}
                  isLastAssistant={isLastAssistant}
                  onRegenerate={regenerateLastResponse}
                />
              );
            })}

            {isGenerating && (
              <div className="message-row assistant-message generating-row">
                <div className="message-container">
                  <div className="message-avatar">
                    <div className="ai-avatar-badge pulse">
                      <Bot size={20} />
                    </div>
                  </div>
                  <div className="message-content-wrapper">
                    <div className="message-header">
                      <span className="sender-name">AI Assistant</span>
                      <span className="typing-status">Thinking & writing...</span>
                    </div>
                    <div className="message-body">
                      <LoadingDots />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={chatBottomRef} style={{ height: '1px' }} />
          </div>
        )}
      </div>

      {/* Floating Prompt Input Box */}
      <footer className="chat-footer-wrapper">
        <PromptInput
          inputValue={inputValue}
          setInputValue={setInputValue}
          onSend={handleSendPrompt}
        />
      </footer>
    </main>
  );
}
