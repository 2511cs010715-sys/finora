import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import {
  Bot,
  User,
  Copy,
  Check,
  RotateCcw,
  Volume2,
  VolumeX,
  Trash2,
  Code2,
} from 'lucide-react';

/**
 * Custom High-Performance Markdown & Code Block Parser
 */
function MarkdownRenderer({ content }) {
  const [copiedCodeIndex, setCopiedCodeIndex] = useState(null);

  const handleCopyCode = (codeText, index) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  // Split content by code blocks: ```lang ... ```
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="markdown-body">
      {parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const lines = part.slice(3, -3).trim().split('\n');
          const firstLine = lines[0].trim();
          const hasLang = firstLine && !firstLine.includes(' ') && !firstLine.includes('=') && !firstLine.includes('(');
          const language = hasLang ? firstLine : 'code';
          const codeLines = hasLang ? lines.slice(1) : lines;
          const rawCode = codeLines.join('\n');

          const isCopied = copiedCodeIndex === index;

          return (
            <div key={index} className="code-block-wrapper">
              <div className="code-block-header">
                <div className="code-lang-label">
                  <Code2 size={14} />
                  <span>{language}</span>
                </div>
                <button
                  className="copy-code-btn"
                  onClick={() => handleCopyCode(rawCode, index)}
                  title="Copy code to clipboard"
                >
                  {isCopied ? (
                    <>
                      <Check size={14} className="text-success" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Copy code</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="code-content">
                <code>{rawCode}</code>
              </pre>
            </div>
          );
        }

        // Render regular markdown text
        return <FormattedText key={index} text={part} />;
      })}
    </div>
  );
}

/**
 * Helper to format headers, lists, tables, inline code, bold/italics
 */
function FormattedText({ text }) {
  if (!text) return null;

  const lines = text.split('\n');
  const elements = [];
  let tableRows = [];
  let inTable = false;

  const flushTable = (keyPrefix) => {
    if (tableRows.length > 0) {
      const headerRow = tableRows[0];
      const dataRows = tableRows.slice(2); // Skip markdown divider row |---|---|

      elements.push(
        <div key={`${keyPrefix}-table`} className="table-responsive">
          <table className="md-table">
            <thead>
              <tr>
                {headerRow.map((cell, cIdx) => (
                  <th key={cIdx}>{renderInline(cell.trim())}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataRows.map((row, rIdx) => (
                <tr key={rIdx}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx}>{renderInline(cell.trim())}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
      inTable = false;
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    // Markdown Table Detection: | col | col |
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      inTable = true;
      const cells = trimmed
        .slice(1, -1)
        .split('|')
        .map((c) => c.trim());
      tableRows.push(cells);
      return;
    } else if (inTable) {
      flushTable(`tbl-${idx}`);
    }

    if (!trimmed) {
      elements.push(<div key={idx} className="line-break" />);
      return;
    }

    // Headings
    if (trimmed.startsWith('### ')) {
      elements.push(<h3 key={idx} className="md-h3">{renderInline(trimmed.slice(4))}</h3>);
    } else if (trimmed.startsWith('## ')) {
      elements.push(<h2 key={idx} className="md-h2">{renderInline(trimmed.slice(3))}</h2>);
    } else if (trimmed.startsWith('# ')) {
      elements.push(<h1 key={idx} className="md-h1">{renderInline(trimmed.slice(2))}</h1>);
    }
    // Blockquote
    else if (trimmed.startsWith('> ')) {
      elements.push(
        <blockquote key={idx} className="md-quote">
          {renderInline(trimmed.slice(2))}
        </blockquote>
      );
    }
    // Bullet List
    else if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      elements.push(
        <div key={idx} className="md-list-item">
          <span className="bullet">•</span>
          <span>{renderInline(trimmed.slice(2))}</span>
        </div>
      );
    }
    // Numbered List
    else if (/^\d+\.\s/.test(trimmed)) {
      const match = trimmed.match(/^(\d+\.)\s(.*)/);
      elements.push(
        <div key={idx} className="md-list-item numbered">
          <span className="number-label">{match[1]}</span>
          <span>{renderInline(match[2])}</span>
        </div>
      );
    }
    // Normal Paragraph
    else {
      elements.push(<p key={idx} className="md-p">{renderInline(trimmed)}</p>);
    }
  });

  if (inTable) {
    flushTable('tbl-end');
  }

  return <>{elements}</>;
}

/**
 * Parses inline elements like **bold**, *italic*, `inline code`
 */
function renderInline(str) {
  if (!str) return '';

  // Regex to split by `code`, **bold**, *italic*
  const tokens = str.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g);

  return tokens.map((token, i) => {
    if (token.startsWith('`') && token.endsWith('`')) {
      return (
        <code key={i} className="inline-code">
          {token.slice(1, -1)}
        </code>
      );
    }
    if (token.startsWith('**') && token.endsWith('**')) {
      return <strong key={i}>{token.slice(2, -2)}</strong>;
    }
    if (token.startsWith('*') && token.endsWith('*')) {
      return <em key={i}>{token.slice(1, -1)}</em>;
    }
    return token;
  });
}

export default function MessageBubble({ message, isLastAssistant, onRegenerate }) {
  const { user } = useAuth();
  const { deleteMessage, toggleSpeak, speakingMessageId } = useChat();
  const [copiedMessage, setCopiedMessage] = useState(false);

  const isUser = message.role === 'user';
  const isSpeaking = speakingMessageId === message._id;

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message.content);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2000);
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
    <div className={`message-row ${isUser ? 'user-message' : 'assistant-message'}`}>
      <div className="message-container">
        <div className="message-avatar">
          {isUser ? (
            <div className="user-avatar-badge" title={user?.name || 'User'}>
              {user?.name ? getInitials(user.name) : <User size={18} />}
            </div>
          ) : (
            <div className="ai-avatar-badge" title="AI Assistant">
              <Bot size={20} />
            </div>
          )}
        </div>

        <div className="message-content-wrapper">
          <div className="message-header">
            <span className="sender-name">{isUser ? user?.name || 'You' : 'AI Assistant'}</span>
            <span className="message-time">
              {message.created_at
                ? new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : ''}
            </span>
          </div>

          <div className="message-body">
            {isUser ? (
              <p className="user-prompt-text">{message.content}</p>
            ) : (
              <MarkdownRenderer content={message.content} />
            )}
          </div>

          {/* Action toolbar */}
          <div className="message-actions-toolbar">
            <button
              className="action-icon-btn"
              onClick={handleCopyMessage}
              title={copiedMessage ? 'Copied!' : 'Copy response'}
            >
              {copiedMessage ? <Check size={15} className="text-success" /> : <Copy size={15} />}
            </button>

            {!isUser && (
              <button
                className={`action-icon-btn ${isSpeaking ? 'active-speaking' : ''}`}
                onClick={() => toggleSpeak(message._id, message.content)}
                title={isSpeaking ? 'Stop speech' : 'Read aloud'}
              >
                {isSpeaking ? <VolumeX size={15} /> : <Volume2 size={15} />}
              </button>
            )}

            {!isUser && isLastAssistant && (
              <button
                className="action-icon-btn"
                onClick={onRegenerate}
                title="Regenerate response"
              >
                <RotateCcw size={15} />
              </button>
            )}

            {message._id && (
              <button
                className="action-icon-btn delete-btn"
                onClick={() => deleteMessage(message._id)}
                title="Delete message"
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
