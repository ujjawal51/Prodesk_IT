/**
 * Sprint 12 Track B: Automated WebSocket & Socket.IO Test Suite
 * Validates Technical FAQ points:
 * - FAQ Q7: CORS handshake and connection
 * - FAQ Q8: Disconnect & cleanup lifecycle
 * - FAQ Q9: socket.broadcast.emit (exclude sender) vs io.emit (include sender)
 */

const { io: Client } = require('socket.io-client');
const http = require('http');
const express = require('express');
const cors = require('cors');
const { corsOptions } = require('../src/config/cors');
const setupSocketServer = require('../src/socket/socketHandler');

async function runTestSuite() {
  console.log('🧪 Starting Sprint 12 WebSocket / Socket.IO Integration Tests...\n');

  // Start dedicated test server on port 5055 to avoid conflicts
  const TEST_PORT = 5055;
  const app = express();
  app.use(cors(corsOptions));
  const server = http.createServer(app);
  const ioServer = setupSocketServer(server);

  await new Promise((resolve) => server.listen(TEST_PORT, resolve));
  console.log(`[Test Setup] Mock Socket.IO server listening on port ${TEST_PORT}`);

  const SERVER_URL = `http://localhost:${TEST_PORT}`;
  let passedTests = 0;
  let totalTests = 5;

  try {
    // -------------------------------------------------------------
    // Test 1: Establish Persistent Bi-directional WebSocket Handshake
    // -------------------------------------------------------------
    console.log('▶ Test 1: Bi-directional Persistent Handshake (Client A & Client B)');
    const clientA = Client(SERVER_URL, { transports: ['websocket'] });
    const clientB = Client(SERVER_URL, { transports: ['websocket'] });

    await Promise.all([
      new Promise((res) => clientA.on('connect', res)),
      new Promise((res) => clientB.on('connect', res))
    ]);

    if (clientA.connected && clientB.connected) {
      console.log(`  ✓ Both Client A (${clientA.id}) and Client B (${clientB.id}) connected via WebSockets.`);
      passedTests++;
    } else {
      throw new Error('Connection handshake failed.');
    }

    // -------------------------------------------------------------
    // Test 2: Latency measurement via Ping-Pong
    // -------------------------------------------------------------
    console.log('\n▶ Test 2: Latency Ping-Pong Roundtrip');
    const startPing = Date.now();
    const pongPromise = new Promise((res) => {
      clientA.once('server_pong', (sentTime) => {
        const roundTripMs = Date.now() - sentTime;
        res(roundTripMs);
      });
    });
    clientA.emit('client_ping', startPing);
    const latency = await pongPromise;
    console.log(`  ✓ Roundtrip latency verified: ${latency}ms`);
    passedTests++;

    // -------------------------------------------------------------
    // Test 3: Global Broadcast (io.emit) - Both Sender and Receiver Get Payload
    // -------------------------------------------------------------
    console.log('\n▶ Test 3: Global Broadcast (io.emit) across Room');
    // Join room
    clientA.emit('user_join', { username: 'Engineer_Alpha', room: 'general' });
    clientB.emit('user_join', { username: 'Engineer_Beta', room: 'general' });
    await new Promise((r) => setTimeout(r, 200));

    const messageText = 'Deployment pipeline to staging initialized.';
    const clientAReceivedMsg = new Promise((res) => {
      const handler = (msg) => {
        if (msg.text === messageText) {
          clientA.off('chat_message', handler);
          res(msg);
        }
      };
      clientA.on('chat_message', handler);
    });

    const clientBReceivedMsg = new Promise((res) => {
      const handler = (msg) => {
        if (msg.text === messageText) {
          clientB.off('chat_message', handler);
          res(msg);
        }
      };
      clientB.on('chat_message', handler);
    });

    clientA.emit('send_message', { text: messageText, room: 'general' });

    const [msgA, msgB] = await Promise.all([clientAReceivedMsg, clientBReceivedMsg]);
    if (msgA.text === messageText && msgB.text === messageText) {
      console.log('  ✓ io.emit verified: Both sender (Client A) and receiver (Client B) received chat payload.');
      passedTests++;
    } else {
      throw new Error('Message broadcast failed to deliver to both participants.');
    }

    // -------------------------------------------------------------
    // Test 4: Broadcast to All EXCEPT Sender (socket.broadcast.emit)
    // -------------------------------------------------------------
    console.log('\n▶ Test 4: Selective Broadcast (socket.broadcast.emit / typing indicator)');
    let senderReceivedTyping = false;

    const senderTypingListener = (data) => {
      if (data.username === 'Engineer_Alpha') {
        senderReceivedTyping = true;
      }
    };
    clientA.on('user_typing', senderTypingListener);

    const clientBReceivedTyping = new Promise((res) => {
      clientB.once('user_typing', (data) => {
        res(data);
      });
    });

    // Client A starts typing
    clientA.emit('typing_start', { room: 'general' });

    const typingPayload = await clientBReceivedTyping;
    // Allow brief time to ensure Client A did NOT receive it
    await new Promise((r) => setTimeout(r, 100));
    clientA.off('user_typing', senderTypingListener);

    if (typingPayload.username === 'Engineer_Alpha' && !senderReceivedTyping) {
      console.log('  ✓ socket.broadcast verified: Client B received typing event, sender Client A was excluded.');
      passedTests++;
    } else {
      throw new Error('Selective broadcast failed: sender improperly received typing event.');
    }

    // -------------------------------------------------------------
    // Test 5: Clean Disconnect Lifecycle (FAQ Q8)
    // -------------------------------------------------------------
    console.log('\n▶ Test 5: Clean Disconnection & React 18 Cleanup Simulation');
    const clientBNotifiedDisconnect = new Promise((res) => {
      clientB.once('chat_message', (msg) => {
        if (msg.action === 'leave' || msg.text.includes('disconnected')) {
          res(msg);
        }
      });
    });

    // Simulate React 18 useEffect return () => socket.disconnect()
    clientA.disconnect();

    const leaveMsg = await clientBNotifiedDisconnect;
    if (leaveMsg) {
      console.log(`  ✓ Clean disconnect validated: Server notified room: "${leaveMsg.text}"`);
      passedTests++;
    }

    clientB.disconnect();
    console.log('\n====================================================');
    console.log(`✅ All ${passedTests}/${totalTests} WebSocket Integration Tests Passed Successfully!`);
    console.log('====================================================\n');

  } catch (err) {
    console.error('\n❌ Test Suite Failed:', err.message);
    process.exitCode = 1;
  } finally {
    await new Promise((res) => server.close(res));
    console.log('[Test Teardown] Server closed.');
  }
}

runTestSuite();
