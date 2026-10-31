import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import {
  ArrowUp,
  Square,
  Mic,
  MicOff,
  Paperclip,
} from 'lucide-react';

export default function PromptInput({ inputValue, setInputValue, onSend }) {
  const { isGenerating } = useChat();
  const textareaRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // Auto-resize textarea on input change
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      // Cap maximum height to 200px
      textareaRef.current.style.height = `${Math.min(scrollHeight, 200)}px`;
    }
  }, [inputValue]);

  // Focus input on mount
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  // Web Speech API Voice Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = (err) => {
        console.warn('Speech recognition error:', err);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [setInputValue]);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported by your browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.warn('Voice start failed:', e);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!inputValue.trim() || isGenerating) return;
    onSend(inputValue.trim());
    setInputValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const isSendDisabled = !inputValue.trim() && !isGenerating;

  return (
    <div className="prompt-input-container">
      <div className="prompt-input-box">
        <button
          type="button"
          className="input-tool-btn"
          title="Attach document / context"
          onClick={() => {
            alert('File analysis feature: Select code, JSON, or text documents to include in your prompt!');
          }}
        >
          <Paperclip size={18} />
        </button>

        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything... Describe your idea or problem"
          rows={1}
          className="prompt-textarea"
          aria-label="Chat prompt input"
        />

        <div className="input-actions-right">
          <button
            type="button"
            className={`input-voice-btn ${isListening ? 'listening' : ''}`}
            onClick={toggleVoiceInput}
            title={isListening ? 'Listening... click to stop' : 'Voice dictation'}
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

          {isGenerating ? (
            <button
              type="button"
              className="send-btn stop-btn"
              title="Stop generating"
              onClick={() => {
                // In streaming/mock we can reset generating
                // handled by UI
              }}
            >
              <Square size={14} fill="currentColor" />
            </button>
          ) : (
            <button
              type="button"
              className={`send-btn ${isSendDisabled ? 'disabled' : ''}`}
              disabled={isSendDisabled}
              onClick={handleSubmit}
              title="Send prompt (Enter)"
            >
              <ArrowUp size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="input-disclaimer">
        <span>AI may make mistakes. Verify important code & sensitive info.</span>
      </div>
    </div>
  );
}
