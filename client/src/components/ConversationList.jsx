import React from 'react';
import './ConversationList.css';

function ConversationList({ conversations, selectedConversation, onSelectConversation }) {
  return (
    <div className="conversation-list">
      <div className="list-header">
        <h2>Conversations</h2>
        <input 
          type="text" 
          placeholder="Search conversations..." 
          className="search-input"
        />
      </div>

      <div className="conversations">
        {conversations.length === 0 ? (
          <div className="empty-list">
            <p>No conversations yet</p>
          </div>
        ) : (
          conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`conversation-item ${selectedConversation?.id === conversation.id ? 'active' : ''}`}
              onClick={() => onSelectConversation(conversation)}
            >
              <div className="conversation-header">
                <span className="customer-name">Customer #{conversation.customer_id}</span>
                <span className="timestamp">
                  {new Date(conversation.updated_at).toLocaleTimeString()}
                </span>
              </div>
              <div className="conversation-preview">
                <span className={`channel-badge ${conversation.last_channel}`}>
                  {conversation.last_channel?.toUpperCase()}
                </span>
                <span className={`status-badge ${conversation.status}`}>
                  {conversation.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ConversationList;

