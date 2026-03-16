import React, { useState, useEffect } from 'react';
import './Settings.css';

function Settings() {
  const [credentials, setCredentials] = useState({
    twilio: {
      accountSid: '',
      authToken: '',
      phoneNumber: ''
    },
    email: {
      host: '',
      port: 587,
      user: '',
      password: '',
      from: ''
    }
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    fetchCredentials();
  }, []);

  const fetchCredentials = async () => {
    try {
      const response = await fetch('/api/settings/credentials');
      if (response.ok) {
        const data = await response.json();
        setCredentials(data);
      }
    } catch (error) {
      console.error('Error fetching credentials:', error);
    }
  };

  const handleChange = (section, field, value) => {
    setCredentials(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/settings/credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      if (response.ok) {
        setMessageType('success');
        setMessage('Credentials saved successfully!');
      } else {
        setMessageType('error');
        setMessage('Failed to save credentials');
      }
    } catch (error) {
      setMessageType('error');
      setMessage('Error saving credentials: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-container">
      <h1>Settings</h1>
      
      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}

      <div className="settings-section">
        <h2>Twilio Configuration</h2>
        <div className="form-group">
          <label>Account SID</label>
          <input
            type="password"
            value={credentials.twilio.accountSid}
            onChange={(e) => handleChange('twilio', 'accountSid', e.target.value)}
            placeholder="Your Twilio Account SID"
          />
        </div>
        <div className="form-group">
          <label>Auth Token</label>
          <input
            type="password"
            value={credentials.twilio.authToken}
            onChange={(e) => handleChange('twilio', 'authToken', e.target.value)}
            placeholder="Your Twilio Auth Token"
          />
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="text"
            value={credentials.twilio.phoneNumber}
            onChange={(e) => handleChange('twilio', 'phoneNumber', e.target.value)}
            placeholder="+1234567890"
          />
        </div>
      </div>

      <div className="settings-section">
        <h2>Email Configuration</h2>
        <div className="form-group">
          <label>SMTP Host</label>
          <input
            type="text"
            value={credentials.email.host}
            onChange={(e) => handleChange('email', 'host', e.target.value)}
            placeholder="smtp.gmail.com"
          />
        </div>
        <div className="form-group">
          <label>SMTP Port</label>
          <input
            type="number"
            value={credentials.email.port}
            onChange={(e) => handleChange('email', 'port', parseInt(e.target.value))}
          />
        </div>
        <div className="form-group">
          <label>Email User</label>
          <input
            type="email"
            value={credentials.email.user}
            onChange={(e) => handleChange('email', 'user', e.target.value)}
            placeholder="your-email@gmail.com"
          />
        </div>
        <div className="form-group">
          <label>Email Password</label>
          <input
            type="password"
            value={credentials.email.password}
            onChange={(e) => handleChange('email', 'password', e.target.value)}
            placeholder="Your email password or app password"
          />
        </div>
        <div className="form-group">
          <label>From Address</label>
          <input
            type="email"
            value={credentials.email.from}
            onChange={(e) => handleChange('email', 'from', e.target.value)}
            placeholder="noreply@example.com"
          />
        </div>
      </div>

      <button 
        className="save-button" 
        onClick={handleSave}
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Save Credentials'}
      </button>
    </div>
  );
}

export default Settings;

