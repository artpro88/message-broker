import React, { useEffect, useRef } from 'react';
import './ThreadView.css';

function ThreadView({ messages, loading }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getChannelIcon = (channel) => {
    const icons = {
      sms: '📱',
      email: '📧',
      livechat: '💬'
    };
    return icons[channel] || '💬';
  };

  const getChannelColor = (channel) => {
    const colors = {
      sms: '#FF6B35',
      email: '#004E89',
      livechat: '#1ABC9C'
    };
    return colors[channel] || '#95A5A6';
  };

  if (loading) {
    return <div className="thread-view loading">Loading messages...</div>;
  }

  return (
    <div className="thread-view">
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-thread">
            <p>No messages yet</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.direction}`}
            >
              <div className="message-header">
                <span 
                  className="channel-indicator"
                  style={{ backgroundColor: getChannelColor(message.channel) }}
                  title={message.channel}
                >
                  {getChannelIcon(message.channel)}
                </span>
                <span className="timestamp">
                  {new Date(message.created_at).toLocaleString()}
                </span>
              </div>
              <div className="message-content">
                {message.message}
              </div>
              {message.file_name && (
                <div className="attachment">
                  <a href={message.file_path} download>
                    📎 {message.file_name}
                  </a>
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

export default ThreadView;

