import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiX, FiSend, FiZap, FiCpu, FiUser, FiTrendingUp } from 'react-icons/fi';

export default function AiAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello Varshini! I am FinVerse Market AI 🤖. Ask me about NIFTY 50 predictions, stock analysis, risk metrics, or portfolio rebalancing!' }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = (textToSend) => {
    const msg = textToSend || inputText;
    if (!msg.trim()) return;

    const newMsgs = [...messages, { sender: 'user', text: msg }];
    setMessages(newMsgs);
    setInputText('');

    setTimeout(() => {
      let reply = "FinVerse Intelligence: Market signals indicate strong bullish momentum across NIFTY 50 and tech equities!";
      const lower = msg.toLowerCase();
      
      if (lower.includes('nifty') || lower.includes('prediction') || lower.includes('forecast')) {
        reply = "📈 NIFTY 50 Forecast: AI Model predicts NIFTY 50 reaching 24,850 within 30 days (+3.2% upside). 50-day SMA shows strong support at 23,900.";
      } else if (lower.includes('stock') || lower.includes('hdfc') || lower.includes('buy')) {
        reply = "📊 HDFC Bank Analysis: Strong Buy rating. P/E ratio is 18.4 (undervalued vs 5-yr avg). AI target price: ₹1,780 (+14% upside potential).";
      } else if (lower.includes('portfolio') || lower.includes('risk') || lower.includes('rebalance')) {
        reply = "🛡️ Portfolio Health: Risk Score 28/100 (Conservative). Equity exposure: 55%, Debt: 30%, Gold: 15%. Reallocating 5% to IT index fund suggested.";
      } else if (lower.includes('crypto') || lower.includes('bitcoin') || lower.includes('btc')) {
        reply = "🪙 Crypto Radar: Bitcoin holding support at $64,200. RSI indicator sits at 54 (neutral momentum). Volatility index: moderate.";
      }

      setMessages([...newMsgs, { sender: 'ai', text: reply }]);
    }, 600);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        className="btn btn-primary rounded-circle shadow-lg d-flex align-items-center justify-content-center border border-light"
        style={{
          position: 'fixed',
          bottom: '25px',
          right: '25px',
          width: '60px',
          height: '60px',
          zIndex: 1060,
          boxShadow: '0 8px 25px rgba(99, 102, 241, 0.5)'
        }}
        onClick={() => setIsOpen(!isOpen)}
        title="FinVerse AI Market Assistant"
      >
        {isOpen ? <FiX size={26} /> : <FiCpu size={28} />}
      </button>

      {/* Floating Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="finverse-card shadow-lg d-flex flex-column"
            style={{
              position: 'fixed',
              bottom: '95px',
              right: '25px',
              width: '390px',
              maxHeight: '540px',
              height: '82vh',
              zIndex: 1060,
              border: '1px solid rgba(99, 102, 241, 0.4)',
              background: 'rgba(15, 23, 42, 0.96)',
              backdropFilter: 'blur(18px)'
            }}
          >
            {/* Chat Header */}
            <div className="p-3 border-bottom border-secondary d-flex justify-content-between align-items-center bg-dark rounded-top">
              <div className="d-flex align-items-center gap-2">
                <div className="p-2 bg-primary-subtle text-primary rounded-circle">
                  <FiCpu size={20} />
                </div>
                <div>
                  <h6 className="fw-bold text-light mb-0">FinVerse AI Market Assistant</h6>
                  <small className="text-success" style={{ fontSize: '0.75rem' }}>🟢 Live Market Telemetry</small>
                </div>
              </div>
              <button className="btn btn-outline-secondary btn-sm p-1 rounded-circle border-0 text-muted" onClick={() => setIsOpen(false)}>
                <FiX size={18} />
              </button>
            </div>

            {/* Chat Body */}
            <div className="p-3 flex-grow-1 overflow-auto d-flex flex-column gap-2" style={{ fontSize: '0.88rem' }}>
              {messages.map((m, idx) => (
                <div key={idx} className={`d-flex ${m.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                  <div
                    className={`p-3 rounded-3 ${m.sender === 'user' ? 'bg-primary text-white' : 'bg-dark text-light border border-secondary'}`}
                    style={{ maxWidth: '85%', lineHeight: '1.5' }}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Prompt Pills */}
            <div className="p-2 border-top border-secondary bg-dark d-flex gap-1 overflow-auto">
              <button className="btn btn-outline-secondary btn-sm rounded-pill text-nowrap px-2 py-1" style={{ fontSize: '0.75rem' }} onClick={() => handleSend('NIFTY 50 prediction')}>
                📈 NIFTY 50 Forecast
              </button>
              <button className="btn btn-outline-secondary btn-sm rounded-pill text-nowrap px-2 py-1" style={{ fontSize: '0.75rem' }} onClick={() => handleSend('Should I buy HDFC Bank?')}>
                📊 Stock Analysis
              </button>
              <button className="btn btn-outline-secondary btn-sm rounded-pill text-nowrap px-2 py-1" style={{ fontSize: '0.75rem' }} onClick={() => handleSend('Portfolio risk evaluation')}>
                🛡️ Portfolio Risk
              </button>
            </div>

            {/* Chat Input */}
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-2 border-top border-secondary bg-dark d-flex gap-2 rounded-bottom">
              <input
                type="text"
                className="form-control form-control-sm bg-dark text-light border-secondary"
                placeholder="Ask FinVerse AI..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <button type="submit" className="btn btn-primary btn-sm rounded px-3">
                <FiSend size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
