const WebSocket = require('ws');

let wss = null;
const clients = new Set();

function initWebSocket(server) {
  if (!process.env.WS_ENABLED || process.env.WS_ENABLED === 'false') {
    console.log('WebSocket disabled');
    return null;
  }

  wss = new WebSocket.Server({ server, path: '/ws' });

  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    clients.add(ws);

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);
        if (data.type === 'subscribe') {
          ws.subscriptions = data.channels || [];
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
      clients.delete(ws);
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      clients.delete(ws);
    });

    ws.send(JSON.stringify({ type: 'connected', message: 'WebSocket connected' }));
  });

  console.log('WebSocket server initialized at /ws');
  return wss;
}

function broadcast(channel, event, data) {
  if (!wss) return;

  const message = JSON.stringify({
    channel,
    event,
    data,
    timestamp: new Date().toISOString(),
  });

  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      if (!client.subscriptions || client.subscriptions.includes(channel)) {
        client.send(message);
      }
    }
  });
}

function broadcastCrowdReport(event, report) {
  broadcast('crowd-reports', event, report);
}

function broadcastSOSRequest(event, request) {
  broadcast('sos-requests', event, request);
}

function getClientCount() {
  return clients.size;
}

function closeWebSocket() {
  if (wss) {
    wss.close();
    console.log('WebSocket server closed');
  }
}

module.exports = {
  initWebSocket,
  broadcast,
  broadcastCrowdReport,
  broadcastSOSRequest,
  getClientCount,
  closeWebSocket,
};
