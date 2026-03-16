import React, { useState } from 'react';
import './ReplyBox.css';

function ReplyBox({ conversation, onSendReply }) {
  const [message, setMessage] = useState('');
  const [selectedChannel, setSelectedChannel] = useState(conversation?.last_channel || 'sms');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;

    setSending(true);
    try {
      await onSendReply(message, selectedChannel);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSend();
    }
  };

  return (
    <div className="reply-box">
      <div className="channel-selector">
        <label>Reply via:</label>
        <div className="channel-buttons">
          <button
            className={`channel-btn ${selectedChannel === 'sms' ? 'active' : ''}`}
            onClick={() => setSelectedChannel('sms')}
          >
            📱 SMS
          </button>
          <button
            className={`channel-btn ${selectedChannel === 'email' ? 'active' : ''}`}
            onClick={() => setSelectedChannel('email')}
          >
            📧 Email
          </button>
          <button
            className={`channel-btn ${selectedChannel === 'livechat' ? 'active' : ''}`}
            onClick={() => setSelectedChannel('livechat')}
          >
            💬 Live Chat
          </button>
        </div>
      </div>

      <div className="message-input-area">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message here... (Ctrl+Enter to send)"
          className="message-input"
          disabled={sending}
        />
      </div>

      <div className="reply-actions">
        <button className="btn-attach">📎 Attach</button>
        <button 
          className="btn-send"
          onClick={handleSend}
          disabled={!message.trim() || sending}
        >
          {sending ? 'Sending...' : 'Send'}
        </button>
      </div>

      <div className="quick-actions">
        <button className="quick-btn">Send Balance</button>
        <button className="quick-btn">Send Limits</button>
        <button className="quick-btn">Send Promo</button>
      </div>
    </div>
  );
}

export default ReplyBox;

