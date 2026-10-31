import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import { Sparkles, ChevronDown, Check, Zap, Cpu, Flame } from 'lucide-react';

const MODELS = [
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    tag: 'Fast & Smart',
    icon: Zap,
    description: 'Great for everyday coding, writing, and quick reasoning.',
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    tag: 'Flagship Intelligence',
    icon: Sparkles,
    description: 'Most capable model for deep reasoning and complex coding.',
  },
  {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    tag: 'Ultra Fast',
    icon: Flame,
    description: 'Blazing speed with massive context window capabilities.',
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    tag: 'Coding Specialist',
    icon: Cpu,
    description: 'Exceptional nuanced reasoning and algorithmic prowess.',
  },
];

export default function ModelSelector() {
  const { selectedModel, setSelectedModel } = useChat();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const current = MODELS.find((m) => m.id === selectedModel) || MODELS[0];
  const CurrentIcon = current.icon;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="model-selector-container" ref={dropdownRef}>
      <button
        className="model-selector-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="model-icon-badge">
          <CurrentIcon size={16} />
        </span>
        <span className="model-btn-name">{current.name}</span>
        <ChevronDown size={14} className={`chevron-icon ${isOpen ? 'open' : ''}`} />
      </button>

      {isOpen && (
        <div className="model-dropdown-menu">
          <div className="model-dropdown-header">Model Selection</div>
          {MODELS.map((model) => {
            const Icon = model.icon;
            const isSelected = model.id === selectedModel;
            return (
              <button
                key={model.id}
                className={`model-option-item ${isSelected ? 'active' : ''}`}
                onClick={() => {
                  setSelectedModel(model.id);
                  setIsOpen(false);
                }}
              >
                <div className="model-option-left">
                  <div className="model-option-icon">
                    <Icon size={16} />
                  </div>
                  <div className="model-option-text">
                    <div className="model-option-title">
                      <span>{model.name}</span>
                      <span className="model-option-tag">{model.tag}</span>
                    </div>
                    <p className="model-option-desc">{model.description}</p>
                  </div>
                </div>
                {isSelected && <Check size={16} className="check-mark" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
