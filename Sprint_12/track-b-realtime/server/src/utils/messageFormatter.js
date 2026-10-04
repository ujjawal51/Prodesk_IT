/**
 * Message formatter and payload validator utility
 */
const { randomUUID } = require('crypto');

function formatMessage(username, text, room = 'general', type = 'user') {
  return {
    id: randomUUID ? randomUUID() : `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    username: username || 'Anonymous',
    text: (text || '').trim(),
    room: room || 'general',
    type: type, // 'user' | 'system' | 'announcement'
    timestamp: new Date().toISOString(),
    displayTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  };
}

function formatSystemNotification(text, room = 'general', action = 'info') {
  return {
    id: `sys_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    username: 'System Core',
    text,
    room,
    action, // 'join' | 'leave' | 'info' | 'typing'
    type: 'system',
    timestamp: new Date().toISOString(),
    displayTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
}

module.exports = {
  formatMessage,
  formatSystemNotification
};
