import React from 'react';
import { useChat } from '../context/ChatContext';
import {
  Globe,
  HelpCircle,
  Lightbulb,
  Briefcase,
  Bug,
  BookOpen,
  Bot,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';

const EXAMPLE_CARDS = [
  {
    icon: Globe,
    title: 'Help me build a website',
    subtitle: 'Generate modern React + Express architecture and code',
    prompt: 'Help me build a website with modern React and Express from scratch',
  },
  {
    icon: HelpCircle,
    title: 'Explain this programming problem',
    subtitle: 'Deep dive into algorithmic complexity and concepts',
    prompt: 'Explain how Dynamic Programming and memoization work with code examples',
  },
  {
    icon: Lightbulb,
    title: 'Give me a project idea',
    subtitle: 'Brainstorm creative, high-impact fullstack applications',
    prompt: 'Give me 3 unique fullstack project ideas that will impress tech recruiters',
  },
  {
    icon: Briefcase,
    title: 'Help me prepare for an interview',
    subtitle: 'Coding challenges, system design, and behavioral tips',
    prompt: 'Help me prepare for a fullstack developer interview with key questions',
  },
  {
    icon: Bug,
    title: 'Debug my code',
    subtitle: 'Pinpoint logic errors, race conditions, and fix bugs',
    prompt: 'How do I debug and fix common asynchronous race conditions in JavaScript?',
  },
  {
    icon: BookOpen,
    title: 'Create a study plan',
    subtitle: 'Structured 4-week roadmap to master modern tech stacks',
    prompt: 'Create a structured 4-week study plan to master backend and database engineering',
  },
];

export default function WelcomeScreen({ onSelectPrompt }) {
  const { sendMessage } = useChat();

  const handleCardClick = (prompt) => {
    if (onSelectPrompt) {
      onSelectPrompt(prompt);
    } else {
      sendMessage(prompt);
    }
  };

  return (
    <div className="welcome-screen-container">
      <div className="welcome-header">
        <div className="welcome-logo-badge">
          <Bot size={36} />
          <span className="sparkle-overlay">
            <Sparkles size={16} />
          </span>
        </div>
        <h1 className="welcome-title">How can I help you today?</h1>
        <p className="welcome-subtitle">
          Ask questions, solve problems, build projects, learn new things, or brainstorm ideas.
        </p>
      </div>

      <div className="examples-grid">
        {EXAMPLE_CARDS.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              className="example-prompt-card"
              onClick={() => handleCardClick(item.prompt)}
            >
              <div className="card-top">
                <div className="card-icon">
                  <Icon size={18} />
                </div>
                <ArrowUpRight size={16} className="card-arrow" />
              </div>
              <div className="card-title">{item.title}</div>
              <div className="card-subtitle">{item.subtitle}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
