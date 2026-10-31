import os
import re
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("FinPlannerAiService")

app = Flask(__name__)
CORS(app)

def get_bilingual_ai_reply(prompt, lang='TE', app_data=None):
    if not prompt:
        return "నమస్కారం! నేను ఫినోరా AI 🤖. మీ అప్లికేషన్ డేటాను వడ్డీ రేట్లతో (Rate of Interest % p.a.) ప్రత్యక్షంగా పర్యవేక్షిస్తున్నాను!" if lang == 'TE' else "Hello! I am FINORA AI 🤖. Monitoring your live application data and EMI Interest Rates (% p.a.)!"
        
    lower = prompt.lower()
    numbers = re.findall(r'\d+[\d,]*', prompt)
    num_val = int(numbers[0].replace(',', '')) if numbers else None

    # Safe extraction of live application data
    ad = app_data or {}
    income_info = ad.get('income', {})
    expense_info = ad.get('expenses', {})
    savings_info = ad.get('savings', {})
    accounts_info = ad.get('accounts', {})
    emis_info = ad.get('emis', {})
    goals_info = ad.get('goals', {})
    investments_info = ad.get('investments', {})
    telemetry_info = ad.get('telemetry', {})

    total_income = income_info.get('totalIncome', 65000)
    total_expenses = expense_info.get('totalExpenses', 42000)
    monthly_savings = savings_info.get('monthlySavings', max(0, total_income - total_expenses))
    savings_rate = savings_info.get('savingsRatePercent', 35.4)
    safe_daily_limit = savings_info.get('safeDailyLimit', 1420)

    net_worth = telemetry_info.get('netWorth', 248650)
    health_score = telemetry_info.get('financialHealthScore', 88)

    total_monthly_emi = emis_info.get('totalMonthlyEmi', 25700)
    overdue_count = emis_info.get('overdueCount', 1)
    overdue_amount = emis_info.get('totalOverdueEmiAmount', 15000)
    emis_list = emis_info.get('emisList', [
        {'title': '🏡 Home Loan EMI', 'amount': 15000, 'interestRate': 8.5},
        {'title': '🚗 Hyundai Creta Car Loan EMI', 'amount': 6500, 'interestRate': 9.1},
        {'title': '📱 iPhone 15 Pro No-Cost EMI', 'amount': 4200, 'interestRate': 0.0}
    ])

    net_position = accounts_info.get('netPosition', 120800)
    total_investments = investments_info.get('totalValue', 82500)

    goals_list = goals_info.get('goalsList', [])
    macbook_goal = goals_list[0] if len(goals_list) > 0 else {'title': 'M3 MacBook Air Goal', 'target': 80000, 'current': 65600, 'percentage': 82}
    emergency_goal = goals_list[1] if len(goals_list) > 1 else {'title': 'Emergency Reserve Fund', 'target': 100000, 'current': 54000, 'percentage': 54}

    # Format EMI details string with Interest Rate (% p.a.) for every loan
    emi_interest_details_te = " | ".join([
        f"{e.get('title', 'EMI')}: ₹{e.get('amount', 0):,} (@ {e.get('interestRate', 8.5)}% p.a. వడ్డీ రేటు)"
        for e in emis_list
    ])
    emi_interest_details_en = " | ".join([
        f"{e.get('title', 'EMI')}: ₹{e.get('amount', 0):,} (@ {e.get('interestRate', 8.5)}% p.a. interest rate)"
        for e in emis_list
    ])

    # Telugu Language Detection & Response Construction
    is_telugu = lang == 'TE' or any(c in prompt for c in ['అ', 'ఆ', 'ఇ', 'ఈ', 'ఉ', 'ఊ', 'ఎ', 'ఏ', 'ఐ', 'ఒ', 'ఓ', 'ఔ', 'క', 'ఖ', 'గ', 'ఘ', 'చ', 'ఛ', 'జ', 'ఝ', 'ట', 'ఠ', 'డ', 'ఢ', 'ణ', 'త', 'థ', 'ద', 'ధ', 'న', 'ప', 'ఫ', 'బ', 'భ', 'మ', 'య', 'ర', 'ల', 'వ', 'శ', 'ష', 'స', 'హ', 'ళ'])

    if is_telugu:
        if any(w in lower for w in ['afford', 'buy', 'spend', 'కొనుగోలు', 'ఖర్చు', 'కొనవచ్చా', 'కొనవచ్చ', 'కొనాలా', 'షాపింగ్']):
            if num_val:
                if num_val <= monthly_savings:
                    return f"✅ అప్లికేషన్ డేటా విశ్లేషణ: అవును! మీ అప్లికేషన్ లోని నెలవారీ మిగులు ₹{monthly_savings:,} మరియు రోజువారీ సురక్షిత పరిమితి ₹{safe_daily_limit:,}/రోజు ప్రకారం మీరు ₹{num_val:,} కొనుగోలును సురక్షితంగా చేయవచ్చు."
                else:
                    return f"⚠️ అప్లికేషన్ డేటా హెచ్చరిక: ₹{num_val:,} ఖర్చు చేయడం మీ ఉచిత నెలవారీ మిగులు ₹{monthly_savings:,} కంటే ఎక్కువ. ఇది మీ M3 మ్యాక్‌బుక్ ఎయిర్ గోల్‌ను ఆలస్యం చేస్తుంది."
            return f"✅ అప్లికేషన్ డేటా విశ్లేషణ: మీ అప్లికేషన్ ప్రకారం మీ వద్ద ₹{monthly_savings:,} నెలవారీ మిగులు మరియు రోజుకు ₹{safe_daily_limit:,} సురక్షిత ఖర్చు పరిమితి అందుబాటులో ఉంది."

        if any(w in lower for w in ['emi', 'loan', 'రుణం', 'ఈఎమ్‌ఐ', 'అప్పు', 'వడ్డీ', 'వాయిదా']):
            if overdue_count > 0:
                return f"💳 EMI & వడ్డీ రేట్ల లైవ్ మానిటర్: మీ మొత్తం నెలవారీ EMI ₹{total_monthly_emi:,}. ⚠️ మీ వద్ద {overdue_count} ఆలస్యమైన EMI ఉంది (మొత్తం ₹{overdue_amount:,}). ప్రతీ లోన్ వడ్డీ రేటు వివరాలు: {emi_interest_details_te}. ఆలస్య రుసుము తప్పించుకోవడానికి EMI Page (/emi) లో వెంటనే చెల్లించండి!"
            else:
                return f"💳 EMI & వడ్డీ రేట్ల లైవ్ మానిటర్: అద్భుతం! మీ అప్లికేషన్ లోని అన్ని EMI చెల్లింపులు సమయానికి పూర్తయ్యాయి. 0 ఆలస్య చెల్లింపులు! మొత్తం నెలవారీ EMI ₹{total_monthly_emi:,}. ప్రతీ లోన్ వడ్డీ రేటు వివరాలు: {emi_interest_details_te}."

        if any(w in lower for w in ['income', 'salary', 'జీతం', 'ఆదాయం', 'సంపాదన', 'రాబడి']):
            return f"💵 ఆదాయ లైవ్ మానిటర్: మీ అప్లికేషన్ డేటా ప్రకారం మొత్తం నెలవారీ ఆదాయం ₹{total_income:,}. ఖర్చులు ₹{total_expenses:,} పోగా ప్రతినెలా నికర పొదుపు మిగులు +₹{monthly_savings:,} ({savings_rate}% పొదుపు రేటు)."

        if any(w in lower for w in ['expense', 'spent', 'spike', 'ఖర్చులు', 'బిల్లులు', 'ఓవర్‌స్పెండ్']):
            return f"⚠️ ఖర్చుల లైవ్ మానిటర్: మీ అప్లికేషన్ లో నమోదైన మొత్తం ఖర్చులు ₹{total_expenses:,} (ఆదాయంలో {100 - savings_rate:.1f}%). అత్యధిక కేటగిరీ Food & Dining (₹10,080) మరియు Rent (₹15,000)."

        if any(w in lower for w in ['health', 'score', 'ఆరోగ్యం', 'స్కోరు', 'స్థితి']):
            return f"🛡️ ఆర్థిక ఆరోగ్య సూచిక: మీ లైవ్ అప్లికేషన్ స్కోరు {health_score}/100 (గ్రేడ్ A+). {savings_rate}% స్థిరమైన పొదుపు రేటు మరియు నికర విలువ ₹{net_worth:,} తో మీ ఆర్థిక స్థితి బలంగా ఉంది."

        if any(w in lower for w in ['goal', 'macbook', 'laptop', 'లక్ష్యం', 'ల్యాప్‌టాప్', 'గోల్']):
            return f"💻 లక్ష్యాల లైవ్ మానిటర్: మీ {macbook_goal.get('title', 'M3 MacBook Air Goal')} ప్రస్తుతం {macbook_goal.get('percentage', 82)}% పూర్తయింది (₹{macbook_goal.get('current', 65600):,} / ₹{macbook_goal.get('target', 80000):,}). అత్యవసర నిధి: {emergency_goal.get('percentage', 54)}% పూర్తయింది."

        if any(w in lower for w in ['emergency', 'fund', 'అత్యవసర', 'నిధి', 'రిజర్వ్']):
            return f"🛡️ అత్యవసర నిధి మానిటర్: మీ అప్లికేషన్ లో Emergency Reserve Fund ప్రస్తుతం {emergency_goal.get('percentage', 54)}% పూర్తయింది (₹{emergency_goal.get('current', 54000):,} / ₹{emergency_goal.get('target', 100000):,})."

        if any(w in lower for w in ['invest', 'stock', 'పెట్టుబడి', 'మ్యూచువల్ ఫండ్', 'షేర్లు']):
            return f"📈 పెట్టుబడుల లైవ్ మానిటర్: మీ అప్లికేషన్ లోని మొత్తం ఇన్వెస్ట్‌మెంట్ పోర్ట్‌ఫోలియో విలువ ₹{total_investments:,}. Mutual Funds (45%), Direct Equities (35%), FDs (15%) మరియు Gold (5%) లో పంపిణీ చేయబడింది."

        if any(w in lower for w in ['account', 'balance', 'bank', 'అకౌంట్', 'బ్యాలెన్స్', 'బ్యాంక్', 'నగదు']):
            return f"🏦 బ్యాంక్ అకౌంట్లు & ఆస్తులు: మీ అప్లికేషన్ లోని మొత్తం లిక్విడ్ ఆస్తుల విలువ ₹{net_position:,}, నికర విలువ ₹{net_worth:,}. HDFC Salary Acc: ₹82,450, SBI Savings Acc: ₹42,800."

        if any(w in lower for w in ['csv', 'import', 'statement', 'స్టేట్‌మెంట్', 'ఇంపోర్ట్']):
            return "📥 CSV స్టేట్‌మెంట్ దిగుమతి: మీ బ్యాంక్ CSV స్టేట్‌మెంట్‌ను అప్‌లోడ్ చేయడానికి Navigation Bar లో '+ Quick Add' లేదా 'CSV Import' మోడల్‌ను ఉపయోగించండి."

        if any(w in lower for w in ['lock', 'pin', 'biometric', 'లాక్', 'పిన్', 'బయోమెట్రిక్']):
            return "🔐 సెక్యూరిటీ మానిటర్: బయోమెట్రిక్ & 4-డిజిట్ PIN సెక్యూరిటీ సురక్షితంగా Accounts & Wallets పేజీకి పరిమితం చేయబడింది."

        return f"🤖 ఫినోరా AI అప్లికేషన్ మానిటర్: మీ ప్రశ్నకు విశ్లేషణ: \"{prompt}\". మీ అప్లికేషన్ డేటా ప్రకారం మొత్తం ఆదాయం: ₹{total_income:,}, ఖర్చులు: ₹{total_expenses:,}, EMI వడ్డీ రేట్లు: {emi_interest_details_te}."

    # English Language Response Construction
    else:
        if any(w in lower for w in ['afford', 'buy', 'spend', 'purchase', 'cost', 'shopping']):
            if num_val:
                if num_val <= monthly_savings:
                    return f"✅ Live Application Evaluation: Yes! Based on your application's net monthly surplus of ₹{monthly_savings:,} and daily safe limit of ₹{safe_daily_limit:,}/day, spending ₹{num_val:,} is completely safe."
                else:
                    return f"⚠️ Live Application Warning: Spending ₹{num_val:,} exceeds your available monthly net surplus of ₹{monthly_savings:,}. It would delay your active savings goals."
            return f"✅ Live Application Evaluation: You have ₹{monthly_savings:,} net monthly surplus available with a safe limit of ₹{safe_daily_limit:,}/day based on your live application data."

        if any(w in lower for w in ['emi', 'loan', 'debt', 'due', 'interest']):
            if overdue_count > 0:
                return f"💳 Live EMI Telemetry: Total monthly EMI liability is ₹{total_monthly_emi:,}. ⚠️ You have {overdue_count} Overdue EMI payment(s) totaling ₹{overdue_amount:,}. Loan Interest Rates breakdown: {emi_interest_details_en}. Pay on the EMI Page (/emi) to clear alerts!"
            else:
                return f"💳 Live EMI Telemetry: All your EMI payments are 100% up to date! 0 Overdue alerts. Total monthly EMI is ₹{total_monthly_emi:,}. Loan Interest Rates breakdown: {emi_interest_details_en}."

        if any(w in lower for w in ['income', 'salary', 'cash flow', 'earning', 'surplus']):
            return f"💵 Live Income Telemetry: According to your application data, total monthly income is ₹{total_income:,}. Net monthly savings surplus after expenses is +₹{monthly_savings:,} ({savings_rate}% savings rate)."

        if any(w in lower for w in ['expense', 'spent', 'spike', 'bill', 'overspend']):
            return f"⚠️ Live Expense Telemetry: Total expenses recorded in your application are ₹{total_expenses:,} against income of ₹{total_income:,}. Top outflows are Housing Rent (₹15,000) and Food & Dining (₹10,080)."

        if any(w in lower for w in ['health', 'score', 'grade', 'index']):
            return f"🛡️ Application Health Index: Your live score is {health_score}/100 (Grade A+). Supported by a {savings_rate}% savings margin and ₹{net_worth:,} total net worth."

        if any(w in lower for w in ['goal', 'macbook', 'target', 'laptop']):
            return f"💻 Live Goal Telemetry: Your {macbook_goal.get('title', 'M3 MacBook Air Goal')} is {macbook_goal.get('percentage', 82)}% complete (₹{macbook_goal.get('current', 65600):,} / ₹{macbook_goal.get('target', 80000):,}). Emergency Fund is at {emergency_goal.get('percentage', 54)}%."

        if any(w in lower for w in ['emergency', 'fund', 'reserve']):
            return f"🛡️ Emergency Fund Telemetry: Emergency Reserve Fund is currently {emergency_goal.get('percentage', 54)}% complete (₹{emergency_goal.get('current', 54000):,} / ₹{emergency_goal.get('target', 100000):,})."

        if any(w in lower for w in ['invest', 'stock', 'portfolio', 'mutual fund']):
            return f"📈 Investment Portfolio Telemetry: Total portfolio value in your application is ₹{total_investments:,} allocated across Mutual Funds (45%), Equities (35%), FDs (15%), and Gold (5%)."

        if any(w in lower for w in ['account', 'balance', 'bank', 'cash', 'wallet']):
            return f"🏦 Accounts & Assets Telemetry: Total liquid position across your accounts is ₹{net_position:,}, total net worth is ₹{net_worth:,}. HDFC Salary Acc: ₹82,450, SBI Savings Acc: ₹42,800."

        if any(w in lower for w in ['csv', 'import', 'statement']):
            return "📥 CSV Statement Import: Use '+ Quick Add' or 'CSV Import' modal on the dashboard header to drop your HDFC/SBI bank CSV statement file."

        if any(w in lower for w in ['lock', 'pin', 'biometric']):
            return "🔐 Security Telemetry: PIN & Biometric protection is active on Accounts & Wallets page (/accounts) protecting balance visibility with 4-digit PIN & Touch ID."

        return f"🤖 FINORA AI Application Monitor: Analyzing query \"{prompt}\". Total EMI: ₹{total_monthly_emi:,}, Interest Rates Breakdown: {emi_interest_details_en}."

@app.route('/', methods=['GET'])
def root_status():
    accept_header = request.headers.get('Accept', '')
    if 'text/html' in accept_header:
        return """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FINORA AI Microservice - Port 5001 Online</title>
    <style>
        body {
            margin: 0;
            padding: 40px 20px;
            background: #0b0f19;
            color: #f8fafc;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 80vh;
        }
        .card {
            background: #0f172a;
            border: 1.5px solid #38bdf8;
            border-radius: 16px;
            padding: 36px;
            max-width: 620px;
            width: 100%;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
        }
        .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(34, 197, 94, 0.15);
            color: #4ade80;
            padding: 6px 14px;
            border-radius: 9999px;
            font-weight: 700;
            border: 1px solid #22c55e;
            font-size: 0.82rem;
            margin-bottom: 18px;
        }
        h1 { margin: 0 0 10px 0; color: #ffffff; font-size: 1.75rem; }
        p { color: #94a3b8; line-height: 1.6; margin: 0 0 20px 0; font-size: 0.95rem; }
        .endpoints {
            background: #070a13;
            padding: 18px;
            border-radius: 10px;
            border: 1px solid #1e293b;
            margin-top: 15px;
        }
        .endpoint {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #1e293b;
            font-size: 0.88rem;
        }
        .endpoint:last-child { border-bottom: none; }
        .method {
            background: #0369a1;
            color: #e0f2fe;
            padding: 2px 8px;
            border-radius: 4px;
            font-weight: 700;
            font-size: 0.75rem;
            font-family: monospace;
        }
        .method.post { background: #15803d; color: #dcfce7; }
        a { color: #38bdf8; text-decoration: none; font-weight: 600; font-family: monospace; }
        a:hover { text-decoration: underline; color: #7dd3fc; }
        .desc { color: #cbd5e1; font-size: 0.82rem; }
        .frontend-link {
            display: block;
            margin-top: 25px;
            text-align: center;
            background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%);
            color: #ffffff;
            padding: 12px 20px;
            border-radius: 8px;
            font-weight: 700;
            text-decoration: none;
            box-shadow: 0 4px 15px rgba(2, 132, 199, 0.4);
        }
    </style>
</head>
<body>
    <div class="card">
        <div class="status-badge">
            <span style="font-size: 1rem;">🟢</span> AI Microservice Online (Port 5001)
        </div>
        <h1>FINORA AI Microservice</h1>
        <p>Smart Savings & Investment AI Microservice is running successfully. Bilingual NLP Reasoning engine (Telugu 🇮🇳 / English 🇬🇧) and application telemetry monitors are active.</p>
        <div class="endpoints">
            <div class="endpoint">
                <div><span class="method">GET</span> <a href="/health">/health</a></div>
                <span class="desc">JSON Health & Status</span>
            </div>
            <div class="endpoint">
                <div><span class="method post">POST</span> <span style="font-family: monospace; color: #38bdf8;">/ai/chat</span></div>
                <span class="desc">Bilingual Voice & Text AI</span>
            </div>
            <div class="endpoint">
                <div><span class="method post">POST</span> <span style="font-family: monospace; color: #38bdf8;">/ai/affordability</span></div>
                <span class="desc">Safe-to-Spend Checks</span>
            </div>
            <div class="endpoint">
                <div><span class="method post">POST</span> <span style="font-family: monospace; color: #38bdf8;">/analyze</span></div>
                <span class="desc">Financial Health Index</span>
            </div>
        </div>
        <a class="frontend-link" href="http://localhost:3000">Open FINORA Frontend (http://localhost:3000) →</a>
    </div>
</body>
</html>""", 200, {'Content-Type': 'text/html; charset=utf-8'}
    
    return jsonify({
        "status": "UP",
        "service": "Smart Savings & Investment AI Microservice",
        "port": 5001,
        "active": True,
        "endpoints": ["/", "/health", "/ai/chat", "/ai/affordability", "/analyze"]
    }), 200

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "UP",
        "service": "Smart Savings & Investment AI Microservice",
        "version": "1.0.0"
    }), 200

@app.route('/ai/affordability', methods=['POST'])
@app.route('/ai/chat', methods=['POST'])
def ai_chat_endpoint():
    try:
        data = request.get_json() or {}
        prompt = data.get('prompt', '') or data.get('query', '')
        lang = data.get('lang', 'TE')
        app_data = data.get('app_data', {})
        
        reply = get_bilingual_ai_reply(prompt, lang, app_data)
        
        return jsonify({
            "success": True,
            "advice": reply,
            "recommendation": reply,
            "reply": reply
        }), 200
    except Exception as e:
        logger.error(f"Error handling AI chat request: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/analyze', methods=['POST'])
def analyze_finances():
    try:
        data = request.get_json() or {}
        
        income = float(data.get('total_income', 50000.0))
        expenses = float(data.get('total_expenses', 30800.0))
        savings = float(data.get('monthly_savings', max(0.0, income - expenses)))
        total_investments = float(data.get('total_investments', 75000.0))
        highest_category = data.get('highest_category', 'Bills')
        goals_avg_progress = float(data.get('goals_avg_progress', 55.0))

        savings_rate = (savings / income * 100.0) if income > 0 else 0.0
        expense_ratio = (expenses / income * 100.0) if income > 0 else 0.0

        savings_score = min(40.0, (savings_rate / 35.0) * 40.0)
        expense_score = max(0.0, min(25.0, (1.0 - (expenses / (income * 0.8 if income > 0 else 1.0))) * 25.0 + 15.0))
        goal_score = min(20.0, (goals_avg_progress / 100.0) * 20.0)
        investment_score = min(15.0, (total_investments / (income * 1.5 if income > 0 else 1.0)) * 15.0)

        health_score = int(round(savings_score + expense_score + goal_score + investment_score))
        health_score = max(20, min(98, health_score))

        suggestions = []

        if savings_rate < 20.0:
            suggestions.append({
                "type": "WARNING",
                "category": "Savings Optimization",
                "title": "Savings Rate Below Benchmark",
                "message": f"Your current savings rate is {savings_rate:.1f}%. Financial benchmarks recommend aiming for at least 20% to 30% monthly savings."
            })
        else:
            suggestions.append({
                "type": "SUCCESS",
                "category": "Savings Discipline",
                "title": "Healthy Savings Margin",
                "message": f"Great job! Your savings rate of {savings_rate:.1f}% provides a solid foundation for wealth growth."
            })

        if expense_ratio > 70.0:
            suggestions.append({
                "type": "WARNING",
                "category": "Expense Management",
                "title": "Elevated Expense Ratio",
                "message": f"Expenses consume {expense_ratio:.1f}% of your monthly income. Highest spending category is currently '{highest_category}'."
            })

        if goals_avg_progress < 50.0:
            suggestions.append({
                "type": "INFO",
                "category": "Goal Velocity",
                "title": "Accelerate Savings Goal Contributions",
                "message": "Your active savings goals are averaging under 50% completion. Consider setting automated monthly contributions."
            })

        if total_investments < income:
            suggestions.append({
                "type": "INFO",
                "category": "Asset Allocation",
                "title": "Consider Diversified Investments",
                "message": "Building a balanced portfolio across Index Funds, Fixed Deposits, and Equities accelerates long-term inflation beating returns."
            })

        return jsonify({
            "success": True,
            "financial_health_score": health_score,
            "savings_rate_percent": round(savings_rate, 2),
            "expense_ratio_percent": round(expense_ratio, 2),
            "suggestions": suggestions,
            "disclaimer": "Smart Savings & Investment Planner is an educational tool. Suggestions are informational estimates and not regulated financial advice."
        }), 200

    except Exception as e:
        logger.error(f"Error executing AI financial analysis: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    logger.info(f"Starting Smart Savings AI Advisory Microservice on port {port}...")
    app.run(host='0.0.0.0', port=port, debug=False, use_reloader=False)
