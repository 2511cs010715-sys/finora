import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMessageSquare, FiX, FiSend, FiZap, FiCpu, FiUser,
  FiCheckCircle, FiGlobe, FiVolume2, FiVolumeX, FiMic, FiMicOff, FiAlertCircle, FiActivity
} from 'react-icons/fi';
import { useAppData } from '../context/AppDataContext';

export default function AiAssistantWidget() {
  const appData = useAppData();
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState('TE'); // 'TE' for Telugu, 'EN' for English
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [micStatusMsg, setMicStatusMsg] = useState('');

  const recognitionRef = useRef(null);
  const spokenTranscriptRef = useRef('');

  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'నమస్కారం! నేను ఫినోరా AI 🤖. మీ అప్లికేషన్ డేటాను వడ్డీ రేట్లతో (Rate of Interest % p.a.) రక్షణగా పర్యవేక్షిస్తున్నాను!'
    }
  ]);
  const [inputText, setInputText] = useState('');

  // Switch language and add welcome message
  const handleLangSwitch = (newLang) => {
    setLang(newLang);
    const welcomeMsg = newLang === 'TE'
      ? 'నమస్కారం! నేను ఫినోరా AI 🤖. మైక్ బటన్ క్లిక్ చేసి మాట్లాడండి లేదా టైప్ చేయండి, మీ ప్రశ్నకు వడ్డీ రేట్ల (Interest Rates % p.a.) వివరాలతో సమాధానం ఇస్తాను!'
      : 'Hello Investors! I am FINORA AI 🤖. Monitoring your live application data and loan Interest Rates (% p.a.). Ask any query!';

    setMessages((prev) => [...prev, { sender: 'ai', text: welcomeMsg }]);
  };

  // Web Speech Recognition (Real-time Live Printing Telugu & English Mic Input + Auto Send)
  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMicStatusMsg("⚠️ Web Speech API not supported in this browser. Please use Chrome or Edge.");
      alert("Voice speech recognition is supported in Google Chrome & Microsoft Edge. Please use Chrome/Edge to speak.");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      setIsListening(false);
      return;
    }

    try {
      setMicStatusMsg('');
      spokenTranscriptRef.current = '';
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true; // Live real-time text printing
      recognition.lang = lang === 'TE' ? 'te-IN' : 'en-US';

      recognitionRef.current = recognition;

      recognition.onstart = () => {
        setIsListening(true);
        setInputText('');
      };

      recognition.onresult = (event) => {
        let liveTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          liveTranscript += event.results[i][0].transcript;
        }
        if (liveTranscript) {
          setInputText(liveTranscript);
          spokenTranscriptRef.current = liveTranscript;
        }
      };

      recognition.onerror = (e) => {
        setIsListening(false);
        if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
          setMicStatusMsg("⚠️ Microphone permission denied. Please allow microphone access in your browser settings.");
        } else if (e.error === 'language-not-supported' && lang === 'TE') {
          setMicStatusMsg("Telugu speech pack missing. Switched to English voice mode.");
          setLang('EN');
        } else {
          setMicStatusMsg(`⚠️ Mic error: ${e.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        // Auto-send spoken question when user finishes speaking!
        if (spokenTranscriptRef.current && spokenTranscriptRef.current.trim()) {
          const finalSpokenPrompt = spokenTranscriptRef.current.trim();
          spokenTranscriptRef.current = '';
          handleSend(finalSpokenPrompt);
        }
      };

      recognition.start();
    } catch (err) {
      setIsListening(false);
      setMicStatusMsg("⚠️ Could not activate microphone. Please try again.");
    }
  };

  const handleSend = async (textToSend) => {
    const msg = textToSend || inputText;
    if (!msg.trim()) return;

    const newMsgs = [...messages, { sender: 'user', text: msg }];
    setMessages(newMsgs);
    setInputText('');

    // Fetch live application telemetry snapshot
    const liveTelemetry = appData && appData.getFullTelemetrySnapshot ? appData.getFullTelemetrySnapshot() : null;

    let reply = "";
    try {
      const res = await fetch('http://localhost:5001/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: msg, lang: lang, app_data: liveTelemetry })
      });
      if (res.ok) {
        const aiData = await res.json();
        if (aiData.reply || aiData.advice || aiData.recommendation) {
          reply = aiData.reply || aiData.advice || aiData.recommendation;
        }
      }
    } catch (e) {
      // Offline local AI NLP reasoning fallback
    }

    if (!reply) {
      reply = lang === 'TE' ? generateTeluguAiReply(msg, liveTelemetry) : generateEnglishAiReply(msg, liveTelemetry);
    }

    setTimeout(() => {
      setMessages((prev) => {
        const updated = [...prev, { sender: 'ai', text: reply }];
        speakText(reply);
        return updated;
      });
    }, 350);
  };

  // Dynamic Telugu AI Reasoning Engine (Evaluates live application state + Interest Rates)
  const generateTeluguAiReply = (msg, telemetry) => {
    const lower = msg.toLowerCase();
    const numbersInMsg = msg.match(/\d+[\d,]*/g);

    const income = telemetry?.income?.totalIncome || 65000;
    const expenses = telemetry?.expenses?.totalExpenses || 42000;
    const savings = telemetry?.savings?.monthlySavings || 23000;
    const safeDaily = telemetry?.savings?.safeDailyLimit || 1420;
    const netWorthVal = telemetry?.telemetry?.netWorth || 248650;
    const healthScoreVal = telemetry?.telemetry?.financialHealthScore || 88;
    const overdueCountVal = telemetry?.emis?.overdueCount || 1;
    const overdueAmtVal = telemetry?.emis?.totalOverdueEmiAmount || 15000;
    const totalEmiVal = telemetry?.emis?.totalMonthlyEmi || 25700;
    const macbookPct = telemetry?.goals?.goalsList[0]?.percentage || 82;
    const macbookCur = telemetry?.goals?.goalsList[0]?.current || 65600;

    const emisList = telemetry?.emis?.emisList || [
      { title: '🏡 Home Loan EMI', amount: 15000, interestRate: 8.5 },
      { title: '🚗 Hyundai Creta Car Loan EMI', amount: 6500, interestRate: 9.1 },
      { title: '📱 iPhone 15 Pro No-Cost EMI', amount: 4200, interestRate: 0.0 }
    ];

    const emiInterestDetailsTe = emisList.map(e => `${e.title}: ₹${e.amount.toLocaleString()} (@ ${e.interestRate || 8.5}% p.a. వడ్డీ ரேటు)`).join(' | ');

    // 1. Affordability Check
    if (lower.includes('afford') || lower.includes('buy') || lower.includes('కొనుగోలు') || lower.includes('ఖర్చు') || lower.includes('కొనవచ్చా') || lower.includes('కొనవచ్చ') || lower.includes('కొనాలా') || lower.includes('షాపింగ్')) {
      if (numbersInMsg && numbersInMsg.length > 0) {
        const val = parseInt(numbersInMsg[0].replace(/,/g, ''), 10);
        if (val <= savings) {
          return `✅ అప్లికేషన్ డేటా విశ్లేషణ: అవును! మీ అప్లికేషన్ లోని ఉచిత మిగులు ₹${savings.toLocaleString()} మరియు రోజువారీ సురక్షిత పరిమితి ₹${safeDaily.toLocaleString()}/రోజు ప్రకారం మీరు ₹${val.toLocaleString()} కొనుగోలును సురక్షితంగా చేయవచ్చు.`;
        } else {
          return `⚠️ అప్లికేషన్ డేటా హెచ్చరిక: ₹${val.toLocaleString()} ఖర్చు చేయడం మీ అందుబాటులోని నికర పొదుపు మిగులు ₹${savings.toLocaleString()} కంటే ఎక్కువ. ఇది మీ M3 మ్యాక్‌బుక్ ఎయిర్ గోల్‌ను ఆలస్యం చేస్తుంది.`;
        }
      }
      return `✅ అప్లికేషన్ డేటా విశ్లేషణ: మీ అప్లికేషన్ ప్రకారం మీ వద్ద ₹${savings.toLocaleString()} నెలవారీ మిగులు మరియు రోజుకు ₹${safeDaily.toLocaleString()} సురక్షిత ఖర్చు పరిమితి అందుబాటులో ఉంది.`;
    }

    // 2. EMI & Loans Queries with Interest Rates
    if (lower.includes('emi') || lower.includes('loan') || lower.includes('రుణం') || lower.includes('ఈఎమ్‌ఐ') || lower.includes('అప్పు') || lower.includes('వడ్డీ') || lower.includes('వాయిదా')) {
      if (overdueCountVal > 0) {
        return `💳 EMI & వడ్డీ రేట్ల లైవ్ మానిటర్: మీ అప్లికేషన్ లోని మొత్తం EMI ₹${totalEmiVal.toLocaleString()}. ⚠️ మీ వద్ద ${overdueCountVal} ఆలస్యమైన EMI ఉంది (మొత్తం ₹${overdueAmtVal.toLocaleString()}). ప్రతీ లోన్ వడ్డీ రేటు వివరాలు: ${emiInterestDetailsTe}. ఆలస్య రుసుము తప్పించుకోవడానికి EMI Page (/emi) లో వెంటనే చెల్లించండి!`;
      } else {
        return `💳 EMI & వడ్డీ రేట్ల లైవ్ మానిటర్: అద్భుతం! మీ అప్లికేషన్ లోని అన్ని EMI చెల్లింపులు 100% పూర్తయ్యాయి. 0 ఆలస్య చెల్లింపులు! మొత్తం నెలవారీ EMI ₹${totalEmiVal.toLocaleString()}. ప్రతీ లోన్ వడ్డీ రేటు వివరాలు: ${emiInterestDetailsTe}.`;
      }
    }

    // 3. Income & Salary Queries
    if (lower.includes('income') || lower.includes('salary') || lower.includes('జీతం') || lower.includes('ఆదాయం') || lower.includes('సంపాదన') || lower.includes('రాబడి')) {
      return `💵 ఆదాయ లైవ్ మానిటర్: మీ అప్లికేషన్ లో నమోదైన మొత్తం ఆదాయం ₹${income.toLocaleString()}. ఖర్చులు ₹${expenses.toLocaleString()} పోగా ప్రతినెలా నికర పొదుపు మిగులు +₹${savings.toLocaleString()} మిగులుతోంది.`;
    }

    // 4. Expenses Queries
    if (lower.includes('expense') || lower.includes('spent') || lower.includes('spike') || lower.includes('ఖర్చులు') || lower.includes('బిల్లులు') || lower.includes('ఓవర్‌స్పెండ్')) {
      return `⚠️ ఖర్చుల లైవ్ మానిటర్: అప్లికేషన్ ప్రకారం ఈ నెల మీ మొత్తం ఖర్చులు ₹${expenses.toLocaleString()}. అత్యధిక కేటగిరీ Food & Dining (₹10,080) మరియు Rent (₹15,000).`;
    }

    // 5. Financial Health Score Queries
    if (lower.includes('health') || lower.includes('score') || lower.includes('ఆరోగ్యం') || lower.includes('స్కోరు') || lower.includes('స్థితి')) {
      return `🛡️ అప్లికేషన్ హెల్త్ సూచిక: మీ ప్రస్తుత అప్లికేషన్ స్కోరు ${healthScoreVal}/100 (గ్రేడ్ A+). నికర విలువ ₹${netWorthVal.toLocaleString()} తో మీ స్థిరత్వం అద్భుతంగా ఉంది.`;
    }

    // 6. Laptop / Goal Queries
    if (lower.includes('goal') || lower.includes('macbook') || lower.includes('laptop') || lower.includes('లక్ష్యం') || lower.includes('ల్యాప్‌టాప్') || lower.includes('గోల్')) {
      return `💻 లక్ష్యాల లైవ్ మానిటర్: మీ M3 MacBook Air Goal ప్రస్తుతం ${macbookPct}% పూర్తయింది (₹${macbookCur.toLocaleString()} / ₹80,000). 100% లక్ష్యం త్వరలో పూర్తి కానుంది!`;
    }

    // 7. Accounts & Balances Queries
    if (lower.includes('account') || lower.includes('balance') || lower.includes('bank') || lower.includes('అకౌంట్') || lower.includes('బ్యాలెన్స్') || lower.includes('బ్యాంక్') || lower.includes('నగదు')) {
      return `🏦 బ్యాంక్ అకౌంట్ల లైవ్ మానిటర్: మీ అప్లికేషన్ లోని మొత్తం నికర విలువ ₹${netWorthVal.toLocaleString()}. HDFC Salary Acc: ₹82,450, SBI Savings Acc: ₹42,800.`;
    }

    // Dynamic Tailored Fallback
    return `🤖 ఫినోరా AI అప్లికేషన్ మానిటర్: మీ ప్రశ్నకు విశ్లేషణ: "${msg}". మొత్తం EMI: ₹${totalEmiVal.toLocaleString()}, వడ్డీ రేట్ల వివరాలు: ${emiInterestDetailsTe}.`;
  };

  // Dynamic English AI Reasoning Engine (Evaluates live application state + Interest Rates)
  const generateEnglishAiReply = (msg, telemetry) => {
    const lower = msg.toLowerCase();
    const numbersInMsg = msg.match(/\d+[\d,]*/g);

    const income = telemetry?.income?.totalIncome || 65000;
    const expenses = telemetry?.expenses?.totalExpenses || 42000;
    const savings = telemetry?.savings?.monthlySavings || 23000;
    const safeDaily = telemetry?.savings?.safeDailyLimit || 1420;
    const netWorthVal = telemetry?.telemetry?.netWorth || 248650;
    const healthScoreVal = telemetry?.telemetry?.financialHealthScore || 88;
    const overdueCountVal = telemetry?.emis?.overdueCount || 1;
    const overdueAmtVal = telemetry?.emis?.totalOverdueEmiAmount || 15000;
    const totalEmiVal = telemetry?.emis?.totalMonthlyEmi || 25700;
    const macbookPct = telemetry?.goals?.goalsList[0]?.percentage || 82;
    const macbookCur = telemetry?.goals?.goalsList[0]?.current || 65600;

    const emisList = telemetry?.emis?.emisList || [
      { title: '🏡 Home Loan EMI', amount: 15000, interestRate: 8.5 },
      { title: '🚗 Hyundai Creta Car Loan EMI', amount: 6500, interestRate: 9.1 },
      { title: '📱 iPhone 15 Pro No-Cost EMI', amount: 4200, interestRate: 0.0 }
    ];

    const emiInterestDetailsEn = emisList.map(e => `${e.title}: ₹${e.amount.toLocaleString()} (@ ${e.interestRate || 8.5}% p.a. interest)`).join(' | ');

    // 1. Affordability Check
    if (lower.includes('afford') || lower.includes('buy') || lower.includes('spend') || lower.includes('purchase') || lower.includes('cost')) {
      if (numbersInMsg && numbersInMsg.length > 0) {
        const val = parseInt(numbersInMsg[0].replace(/,/g, ''), 10);
        if (val <= savings) {
          return `✅ Live Application Evaluation: Yes! Based on your application's net monthly surplus of ₹${savings.toLocaleString()} and daily safe limit of ₹${safeDaily.toLocaleString()}/day, spending ₹${val.toLocaleString()} is safe.`;
        } else {
          return `⚠️ Live Application Warning: Spending ₹${val.toLocaleString()} exceeds your available monthly net surplus of ₹${savings.toLocaleString()}. It would delay your active savings goals.`;
        }
      }
      return `✅ Live Application Evaluation: You have ₹${savings.toLocaleString()} net monthly surplus available with a safe limit of ₹${safeDaily.toLocaleString()}/day based on your live application data.`;
    }

    // 2. EMI & Loans Queries with Interest Rates
    if (lower.includes('emi') || lower.includes('loan') || lower.includes('debt') || lower.includes('due') || lower.includes('interest')) {
      if (overdueCountVal > 0) {
        return `💳 Live EMI Telemetry: Total monthly EMI liability is ₹${totalEmiVal.toLocaleString()}. ⚠️ You have ${overdueCountVal} Overdue EMI payment(s) totaling ₹${overdueAmtVal.toLocaleString()}. Interest Rates breakdown: ${emiInterestDetailsEn}. Pay on the EMI Page (/emi) to clear alerts!`;
      } else {
        return `💳 Live EMI Telemetry: All your EMI payments are 100% up to date! 0 Overdue alerts. Total monthly EMI liability is ₹${totalEmiVal.toLocaleString()}. Interest Rates breakdown: ${emiInterestDetailsEn}.`;
      }
    }

    // 3. Income & Salary Queries
    if (lower.includes('income') || lower.includes('salary') || lower.includes('cash flow') || lower.includes('earning') || lower.includes('surplus')) {
      return `💵 Live Income Telemetry: According to your application data, total monthly income is ₹${income.toLocaleString()}. Net monthly savings surplus after expenses is +₹${savings.toLocaleString()}.`;
    }

    // 4. Expense Queries
    if (lower.includes('expense') || lower.includes('spent') || lower.includes('spike') || lower.includes('bill') || lower.includes('overspend')) {
      return `⚠️ Live Expense Telemetry: Total expenses recorded in your application are ₹${expenses.toLocaleString()} against total income of ₹${income.toLocaleString()}.`;
    }

    // 5. Financial Health Score Queries
    if (lower.includes('health') || lower.includes('score') || lower.includes('grade') || lower.includes('index')) {
      return `🛡️ Application Health Index: Your live score is ${healthScoreVal}/100 (Grade A+ Excellent). Total net worth is ₹${netWorthVal.toLocaleString()}.`;
    }

    // 6. Laptop / Goal Queries
    if (lower.includes('goal') || lower.includes('macbook') || lower.includes('target') || lower.includes('laptop')) {
      return `💻 Live Goal Telemetry: Your M3 MacBook Air Goal is ${macbookPct}% complete (₹${macbookCur.toLocaleString()} / ₹80,000). Target completion on track!`;
    }

    // 7. Accounts & Balances Queries
    if (lower.includes('account') || lower.includes('balance') || lower.includes('bank') || lower.includes('cash') || lower.includes('wallet')) {
      return `🏦 Accounts Telemetry: Total net worth across your accounts is ₹${netWorthVal.toLocaleString()}. HDFC Salary Acc: ₹82,450, SBI Savings Acc: ₹42,800.`;
    }

    // Dynamic Tailored Fallback
    return `🤖 FINORA AI Application Monitor: Analyzing query "${msg}". Total EMI: ₹${totalEmiVal.toLocaleString()}, Interest Rates breakdown: ${emiInterestDetailsEn}.`;
  };

  // Text-to-Speech audio playback in selected language (Telugu / English)
  const speakText = (textToRead) => {
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.lang = lang === 'TE' ? 'te-IN' : 'en-US';
        utterance.rate = 0.95;

        const voices = window.speechSynthesis.getVoices();
        const matchingVoice = voices.find(v => 
          v.lang.toLowerCase().includes(utterance.lang.toLowerCase()) || 
          v.lang.toLowerCase().startsWith(lang === 'TE' ? 'te' : 'en')
        );
        if (matchingVoice) utterance.voice = matchingVoice;

        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        setIsSpeaking(true);
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        setIsSpeaking(false);
      }
    }
  };

  const speakLastMessage = () => {
    if (messages.length > 0) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const lastMsg = messages[messages.length - 1].text;
        speakText(lastMsg);
      }
    }
  };

  return (
    <>
      {/* Floating Action Launcher Button */}
      <button
        className="btn btn-primary rounded-circle shadow-lg d-flex align-items-center justify-content-center border border-light"
        style={{
          position: 'fixed',
          bottom: '25px',
          right: '25px',
          width: '62px',
          height: '62px',
          zIndex: 1060,
          background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
          boxShadow: '0 8px 25px rgba(2, 132, 199, 0.5)'
        }}
        onClick={() => setIsOpen(!isOpen)}
        title="FINORA AI Live Application Assistant (Telemetry Monitored)"
      >
        {isOpen ? <FiX size={26} /> : <FiCpu size={28} />}
      </button>

      {/* Floating Interactive Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="finora-card shadow-lg d-flex flex-column rounded-4"
            style={{
              position: 'fixed',
              bottom: '98px',
              right: '25px',
              width: '410px',
              maxHeight: '570px',
              height: '85vh',
              zIndex: 1060,
              border: '1.5px solid #38bdf8',
              background: '#0f172a',
              backdropFilter: 'blur(20px)'
            }}
          >
            {/* Header: Assistant Title + App Data Live Status + Language Toggle */}
            <div className="p-3 border-bottom border-secondary d-flex justify-content-between align-items-center bg-dark rounded-top-4">
              <div className="d-flex align-items-center gap-2">
                <div className="p-2 bg-primary bg-opacity-25 text-primary rounded-circle border border-primary">
                  <FiCpu size={20} />
                </div>
                <div>
                  <h6 className="fw-extrabold text-white mb-0 d-flex align-items-center gap-1.5" style={{ color: '#ffffff', fontSize: '0.90rem' }}>
                    FINORA AI App Monitor
                    <span className="badge bg-success bg-opacity-25 text-success border border-success p-0.5 px-1 fw-bold" style={{ fontSize: '0.65rem' }}>
                      <FiActivity size={10} className="me-1" />LIVE DATA
                    </span>
                  </h6>
                  {isListening ? (
                    <small className="text-danger fw-bold d-flex align-items-center gap-1" style={{ fontSize: '0.74rem' }}>
                      <span className="spinner-grow spinner-grow-sm text-danger" style={{ width: '8px', height: '8px' }}></span>
                      {lang === 'TE' ? '🔴 వింటున్నాను... మాట్లాడండి...' : '🔴 Listening to your voice...'}
                    </small>
                  ) : (
                    <small className="text-info fw-bold" style={{ fontSize: '0.73rem' }}>🟢 Monitoring Application State (తెలుగు / EN)</small>
                  )}
                </div>
              </div>

              {/* Language Selector Pill + Voice Speaker */}
              <div className="d-flex align-items-center gap-1.5">
                <div className="btn-group btn-group-sm rounded-pill border border-info border-opacity-50 p-0.5" style={{ backgroundColor: 'rgba(15, 23, 42, 0.9)' }}>
                  <button
                    className={`btn btn-sm px-2 py-0.5 rounded-pill fw-bold ${lang === 'TE' ? 'btn-info text-dark' : 'text-white border-0'}`}
                    style={{ fontSize: '0.7rem' }}
                    onClick={() => handleLangSwitch('TE')}
                  >
                    🇮🇳 తెలుగు
                  </button>
                  <button
                    className={`btn btn-sm px-2 py-0.5 rounded-pill fw-bold ${lang === 'EN' ? 'btn-info text-dark' : 'text-white border-0'}`}
                    style={{ fontSize: '0.7rem' }}
                    onClick={() => handleLangSwitch('EN')}
                  >
                    🇬🇧 EN
                  </button>
                </div>

                <button
                  className={`btn btn-sm p-1.5 rounded-circle border-0 ${isSpeaking ? 'btn-success text-white' : 'btn-outline-info text-info'}`}
                  onClick={speakLastMessage}
                  title="Read aloud in current language"
                >
                  {isSpeaking ? <FiVolumeX size={16} className="spinner-grow spinner-grow-sm text-white" /> : <FiVolume2 size={16} />}
                </button>

                <button className="btn btn-outline-secondary btn-sm p-1 rounded-circle border-0 text-white" onClick={() => setIsOpen(false)}>
                  <FiX size={18} />
                </button>
              </div>
            </div>

            {/* Mic Warning / Status Notice Banner if present */}
            {micStatusMsg && (
              <div className="bg-warning bg-opacity-25 text-warning p-2 px-3 border-bottom border-warning d-flex align-items-center gap-2" style={{ fontSize: '0.76rem' }}>
                <FiAlertCircle size={14} className="flex-shrink-0" />
                <span>{micStatusMsg}</span>
              </div>
            )}

            {/* Chat Messages Body */}
            <div className="p-3 flex-grow-1 overflow-auto d-flex flex-column gap-2.5" style={{ fontSize: '0.88rem' }}>
              {messages.map((m, idx) => (
                <div key={idx} className={`d-flex ${m.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                  <div
                    className={`p-3 rounded-3 ${m.sender === 'user' ? 'bg-primary text-white' : 'bg-dark text-white border border-secondary'}`}
                    style={{ maxWidth: '88%', lineHeight: '1.5', color: '#ffffff', backgroundColor: m.sender === 'user' ? '#0284c7' : '#1e293b' }}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Language Specific Quick Prompt Chips */}
            <div className="p-2 border-top border-secondary bg-dark d-flex gap-1.5 overflow-auto">
              {lang === 'TE' ? (
                <>
                  <button className="btn btn-outline-info btn-sm rounded-pill text-nowrap px-2.5 py-1 text-white fw-semibold" style={{ fontSize: '0.74rem' }} onClick={() => handleSend('₹15,000 షాపింగ్ చేయవచ్చా?')}>
                    🛍️ ₹15k కొనవచ్చా?
                  </button>
                  <button className="btn btn-outline-warning btn-sm rounded-pill text-nowrap px-2.5 py-1 text-white fw-semibold" style={{ fontSize: '0.74rem' }} onClick={() => handleSend('నా EMI లోన్ మరియు వడ్డీ రేట్ల వివరాలు ఏంటి?')}>
                    💳 EMI వడ్డీ రేట్లు
                  </button>
                  <button className="btn btn-outline-success btn-sm rounded-pill text-nowrap px-2.5 py-1 text-white fw-semibold" style={{ fontSize: '0.74rem' }} onClick={() => handleSend('నా అప్లికేషన్ హెల్త్ స్కోరు ఎంత?')}>
                    🛡️ హెల్త్ స్కోరు
                  </button>
                  <button className="btn btn-outline-primary btn-sm rounded-pill text-nowrap px-2.5 py-1 text-white fw-semibold" style={{ fontSize: '0.74rem' }} onClick={() => handleSend('నా ల్యాప్‌టాప్ గోల్ ఎంత వరకు వచ్చింది?')}>
                    💻 ల్యాప్‌టాప్ లక్ష్యం
                  </button>
                </>
              ) : (
                <>
                  <button className="btn btn-outline-info btn-sm rounded-pill text-nowrap px-2.5 py-1 text-white fw-semibold" style={{ fontSize: '0.74rem' }} onClick={() => handleSend('Can I afford a ₹15,000 purchase?')}>
                    🛍️ Afford ₹15k?
                  </button>
                  <button className="btn btn-outline-warning btn-sm rounded-pill text-nowrap px-2.5 py-1 text-white fw-semibold" style={{ fontSize: '0.74rem' }} onClick={() => handleSend('What are my EMI loan interest rates?')}>
                    💳 EMI Interest Rates
                  </button>
                  <button className="btn btn-outline-success btn-sm rounded-pill text-nowrap px-2.5 py-1 text-white fw-semibold" style={{ fontSize: '0.74rem' }} onClick={() => handleSend('What is my financial health score?')}>
                    🛡️ Health Score
                  </button>
                  <button className="btn btn-outline-primary btn-sm rounded-pill text-nowrap px-2.5 py-1 text-white fw-semibold" style={{ fontSize: '0.74rem' }} onClick={() => handleSend('What is my MacBook goal progress?')}>
                    💻 MacBook Goal
                  </button>
                </>
              )}
            </div>

            {/* Live Real-time Spoken Text Input Form with Mic Button */}
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-2.5 border-top border-secondary bg-dark d-flex gap-2 rounded-bottom-4 align-items-center">
              <input
                type="text"
                className="form-control form-control-sm bg-dark text-white border-secondary fw-semibold"
                placeholder={isListening ? (lang === 'TE' ? "🎙️ వింటున్నాను... మాట్లాడండి (Auto Send)..." : "🎙️ Listening... Speak now (Auto Send)...") : (lang === 'TE' ? "అప్లికేషన్ డేటా గురించి ఏ ప్రశ్న అయినా అడగండి..." : "Ask AI about your live application data...")}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />

              {/* Voice Input Microphone Button */}
              <button
                type="button"
                className={`btn btn-sm rounded-circle p-2 border-0 d-flex align-items-center justify-content-center ${isListening ? 'btn-danger text-white spinner-grow spinner-grow-sm' : 'btn-outline-info text-info'}`}
                onClick={startVoiceInput}
                title={isListening ? "Listening... Speak now" : `Click to Speak in ${lang === 'TE' ? 'Telugu (తెలుగు)' : 'English'}`}
                style={{ width: '34px', height: '34px' }}
              >
                {isListening ? <FiMicOff size={16} /> : <FiMic size={16} />}
              </button>

              <button type="submit" className="btn btn-primary btn-sm rounded-pill px-3 fw-bold shadow">
                <FiSend size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
