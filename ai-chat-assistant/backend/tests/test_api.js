/**
 * Backend API Integration Test Script
 */
const http = require('http');

const PORT = 5000;
const BASE_URL = `http://localhost:${PORT}`;

async function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const reqOptions = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    };

    const req = http.request(url, reqOptions, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting Backend API Verification Tests...\n');

  try {
    // 1. Health check
    console.log('1️⃣ Testing Health Check...');
    const health = await request('/api/health');
    console.log('Health Status:', health.status, health.data);
    if (health.status !== 200) throw new Error('Health check failed');

    // 2. User Registration
    console.log('\n2️⃣ Testing User Registration...');
    const testEmail = `testuser_${Date.now()}@example.com`;
    const regRes = await request('/api/auth/register', {
      method: 'POST',
      body: {
        name: 'Alex Developer',
        email: testEmail,
        password: 'password123',
      },
    });
    console.log('Register Status:', regRes.status, 'User Name:', regRes.data?.user?.name);
    if (regRes.status !== 201 || !regRes.data?.token) throw new Error('Registration failed');
    const token = regRes.data.token;

    // 3. User Profile
    console.log('\n3️⃣ Testing User Profile Auth...');
    const profileRes = await request('/api/auth/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Profile Status:', profileRes.status, 'Email:', profileRes.data?.user?.email);
    if (profileRes.status !== 200) throw new Error('Profile lookup failed');

    // 4. Send Chat Prompt
    console.log('\n4️⃣ Testing /api/chat Endpoint...');
    const chatRes = await request('/api/chat', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: {
        prompt: 'Help me build a website with modern React and Express',
        model: 'gpt-4o-mini',
      },
    });
    console.log('Chat Status:', chatRes.status);
    console.log('Conversation Title:', chatRes.data?.conversation?.title);
    console.log('Assistant Output (snippet):', chatRes.data?.assistant_message?.content?.slice(0, 100) + '...');
    if (chatRes.status !== 200 || !chatRes.data?.assistant_message?.content) {
      throw new Error('Chat completion failed');
    }
    const conversationId = chatRes.data.conversation_id;

    // 5. Follow-up Chat Message
    console.log('\n5️⃣ Testing Contextual Follow-up Chat...');
    const followUpRes = await request('/api/chat', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: {
        conversation_id: conversationId,
        prompt: 'Can you show me how to debug any errors in this code?',
      },
    });
    console.log('Follow-up Status:', followUpRes.status);
    console.log('Follow-up AI Output (snippet):', followUpRes.data?.assistant_message?.content?.slice(0, 100) + '...');

    // 6. Get All Conversations
    console.log('\n6️⃣ Testing Conversations List...');
    const convsRes = await request('/api/conversations', {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Conversations Count:', convsRes.data?.count);
    if (convsRes.data?.count < 1) throw new Error('Conversation list empty');

    // 7. Rename Conversation
    console.log('\n7️⃣ Testing Conversation Rename...');
    const renameRes = await request(`/api/conversations/${conversationId}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: { title: 'Web App Roadmap & Debugging' },
    });
    console.log('Updated Title:', renameRes.data?.conversation?.title);

    console.log('\n🎉 ALL BACKEND API TESTS PASSED SUCCESSFULLY! 🎉\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Allow server a moment to spin up if run directly
setTimeout(runTests, 1500);
