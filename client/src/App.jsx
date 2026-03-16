import React, { useState, useEffect } from 'react';
import ConversationList from './components/ConversationList';
import ThreadView from './components/ThreadView';
import CustomerInfo from './components/CustomerInfo';
import ReplyBox from './components/ReplyBox';
import Settings from './components/Settings';
import './App.css';

function App() {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState('conversations');

  useEffect(() => {
    fetchConversations();

    // Initialize Socket.IO connection
    // const socket = io('http://localhost:3000');
    // socket.on('new_message', (data) => {
    //   // Handle new incoming message
    // });
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/conversations');
      if (response.ok) {
        const data = await response.json();
        setConversations(data);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const handleSelectConversation = async (conversation) => {
    setSelectedConversation(conversation);
    setLoading(true);
    
    try {
      // Fetch conversation messages
      const response = await fetch(`/api/conversations/${conversation.id}`);
      const data = await response.json();
      setMessages(data.messages);

      // Fetch customer info
      const customerResponse = await fetch(`/api/customers/${conversation.customer_id}`);
      const customerData = await customerResponse.json();
      setCustomer(customerData);
    } catch (error) {
      console.error('Error loading conversation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async (message, channel) => {
    if (!selectedConversation || !customer) return;

    try {
      const endpoint = `/api/conversations/${selectedConversation.id}/reply/${channel}`;
      const payload = {
        customerId: customer.id,
        message
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        // Refresh messages
        const messagesResponse = await fetch(`/api/conversations/${selectedConversation.id}`);
        const data = await messagesResponse.json();
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="navbar-brand">Message Broker v2</div>
        <div className="navbar-menu">
          <button
            className={`nav-button ${currentPage === 'conversations' ? 'active' : ''}`}
            onClick={() => setCurrentPage('conversations')}
          >
            Conversations
          </button>
          <button
            className={`nav-button ${currentPage === 'settings' ? 'active' : ''}`}
            onClick={() => setCurrentPage('settings')}
          >
            Settings
          </button>
        </div>
      </nav>

      {currentPage === 'conversations' ? (
        <div className="app-content">
          <div className="sidebar">
            <ConversationList
              conversations={conversations}
              selectedConversation={selectedConversation}
              onSelectConversation={handleSelectConversation}
            />
          </div>

          <div className="main-content">
            {selectedConversation ? (
              <>
                <div className="thread-section">
                  <ThreadView messages={messages} loading={loading} />
                </div>
                <div className="reply-section">
                  <ReplyBox
                    conversation={selectedConversation}
                    onSendReply={handleSendReply}
                  />
                </div>
              </>
            ) : (
              <div className="empty-state">
                <p>Select a conversation to view messages</p>
              </div>
            )}
          </div>

          {customer && (
            <div className="customer-panel">
              <CustomerInfo customer={customer} />
            </div>
          )}
        </div>
      ) : (
        <Settings />
      )}
    </div>
  );
}

export default App;

