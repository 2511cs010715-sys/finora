import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { conversationAPI, chatAPI } from '../services/api';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');
  const [errorBanner, setErrorBanner] = useState(null);
  const [speakingMessageId, setSpeakingMessageId] = useState(null);

  // Load conversations when user is logged in
  const fetchConversations = useCallback(async () => {
    if (!isAuthenticated) {
      setConversations([]);
      setActiveId(null);
      setMessages([]);
      return;
    }
    setLoadingList(true);
    try {
      const res = await conversationAPI.getConversations();
      if (res.data.success) {
        setConversations(res.data.conversations);
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
    } finally {
      setLoadingList(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Load messages when activeId changes
  const selectConversation = async (id) => {
    if (!id) {
      setActiveId(null);
      setActiveConversation(null);
      setMessages([]);
      return;
    }

    setActiveId(id);
    setLoadingMessages(true);
    setErrorBanner(null);

    try {
      const res = await conversationAPI.getConversationById(id);
      if (res.data.success) {
        setActiveConversation(res.data.conversation);
        setMessages(res.data.messages || []);
        if (res.data.conversation?.model) {
          setSelectedModel(res.data.conversation.model);
        }
      }
    } catch (err) {
      console.error('Error loading conversation:', err);
      setErrorBanner('Failed to load conversation history.');
    } finally {
      setLoadingMessages(false);
    }
  };

  // Start a fresh new chat
  const startNewChat = () => {
    setActiveId(null);
    setActiveConversation(null);
    setMessages([]);
    setErrorBanner(null);
  };

  // Send a new prompt
  const sendMessage = async (promptText) => {
    if (!promptText || !promptText.trim() || isGenerating) return;

    const trimmedPrompt = promptText.trim();
    setIsGenerating(true);
    setErrorBanner(null);

    // Optimistically add user message to UI
    const tempUserMsg = {
      _id: `temp-user-${Date.now()}`,
      role: 'user',
      content: trimmedPrompt,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const payload = {
        prompt: trimmedPrompt,
        conversation_id: activeId || undefined,
        model: selectedModel,
      };

      const res = await chatAPI.sendMessage(payload);

      if (res.data.success) {
        const { conversation_id, conversation, user_message, assistant_message } = res.data;

        // Replace temp user message and append assistant message
        setMessages((prev) => {
          const filtered = prev.filter((m) => m._id !== tempUserMsg._id);
          return [...filtered, user_message, assistant_message];
        });

        if (!activeId) {
          setActiveId(conversation_id);
          setActiveConversation(conversation);
        }

        // Refresh conversation sidebar list to show latest title / timestamp
        fetchConversations();
      }
    } catch (err) {
      console.error('Error sending message:', err);
      const msg = err.response?.data?.message || 'Error communicating with AI server.';
      setErrorBanner(msg);

      // Add temporary error message in chat
      const errorAssistantMsg = {
        _id: `err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ **Error**: ${msg}\nPlease try sending your message again.`,
        created_at: new Date().toISOString(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorAssistantMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  // Regenerate last assistant response
  const regenerateLastResponse = async () => {
    if (!activeId || isGenerating) return;

    setIsGenerating(true);
    setErrorBanner(null);

    try {
      const res = await chatAPI.regenerateMessage({
        conversation_id: activeId,
        model: selectedModel,
      });

      if (res.data.success) {
        const { assistant_message } = res.data;
        setMessages((prev) => {
          // If last message was assistant, replace it, else append
          const copy = [...prev];
          if (copy.length > 0 && copy[copy.length - 1].role === 'assistant') {
            copy[copy.length - 1] = assistant_message;
            return copy;
          }
          return [...copy, assistant_message];
        });
      }
    } catch (err) {
      console.error('Error regenerating:', err);
      setErrorBanner('Failed to regenerate response.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Rename a conversation
  const renameConversation = async (id, newTitle) => {
    try {
      const res = await conversationAPI.updateTitle(id, newTitle);
      if (res.data.success) {
        setConversations((prev) =>
          prev.map((c) => (c._id === id || c.id === id ? { ...c, title: newTitle } : c))
        );
        if (activeId === id) {
          setActiveConversation((prev) => (prev ? { ...prev, title: newTitle } : prev));
        }
      }
    } catch (err) {
      console.error('Error renaming conversation:', err);
    }
  };

  // Delete a conversation
  const deleteConversation = async (id) => {
    try {
      await conversationAPI.deleteConversation(id);
      setConversations((prev) => prev.filter((c) => c._id !== id && c.id !== id));
      if (activeId === id) {
        startNewChat();
      }
    } catch (err) {
      console.error('Error deleting conversation:', err);
    }
  };

  // Delete an individual message
  const deleteMessage = async (messageId) => {
    try {
      await chatAPI.deleteMessage(messageId);
      setMessages((prev) => prev.filter((m) => m._id !== messageId && m.id !== messageId));
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  };

  // Export conversation
  const exportConversation = (format = 'markdown') => {
    if (!messages.length) return;

    let content = '';
    const title = activeConversation?.title || 'conversation';
    const date = new Date().toLocaleDateString();

    if (format === 'json') {
      content = JSON.stringify(
        {
          title,
          date,
          model: selectedModel,
          messages,
        },
        null,
        2
      );
    } else if (format === 'markdown') {
      content = `# ${title}\n*Exported on ${date}*\n\n---\n\n`;
      messages.forEach((m) => {
        content += `### ${m.role === 'user' ? '👤 User' : '🤖 AI Assistant'}\n\n${m.content}\n\n---\n\n`;
      });
    } else {
      // Plain text
      content = `${title}\nExported on ${date}\n\n`;
      messages.forEach((m) => {
        content += `${m.role.toUpperCase()}:\n${m.content}\n\n`;
      });
    }

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.${format === 'json' ? 'json' : format === 'markdown' ? 'md' : 'txt'}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Text-To-Speech (TTS)
  const toggleSpeak = (messageId, text) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in your browser.');
      return;
    }

    if (speakingMessageId === messageId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Strip markdown formatting for cleaner speech
    const cleanText = text.replace(/[#*`_~[\]()]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    setSpeakingMessageId(messageId);
    window.speechSynthesis.speak(utterance);
  };

  // Filtered conversations for search
  const filteredConversations = conversations.filter((c) =>
    (c.title || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ChatContext.Provider
      value={{
        conversations: filteredConversations,
        allConversations: conversations,
        activeId,
        activeConversation,
        messages,
        loadingList,
        loadingMessages,
        isGenerating,
        searchQuery,
        setSearchQuery,
        selectedModel,
        setSelectedModel,
        errorBanner,
        setErrorBanner,
        speakingMessageId,
        selectConversation,
        startNewChat,
        sendMessage,
        regenerateLastResponse,
        renameConversation,
        deleteConversation,
        deleteMessage,
        exportConversation,
        toggleSpeak,
        fetchConversations,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
