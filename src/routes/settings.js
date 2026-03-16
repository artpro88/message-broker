import express from 'express';
import config from '../config.js';

const router = express.Router();

// Store credentials in memory (in production, use a database)
let storedCredentials = {
  twilio: {
    accountSid: config.twilio.accountSid || '',
    authToken: config.twilio.authToken || '',
    phoneNumber: config.twilio.phoneNumber || ''
  },
  email: {
    host: config.email.host || '',
    port: config.email.port || 587,
    user: config.email.user || '',
    password: config.email.password || '',
    from: config.email.from || ''
  }
};

// GET credentials (masked for security)
router.get('/credentials', (req, res) => {
  try {
    const maskedCredentials = {
      twilio: {
        accountSid: storedCredentials.twilio.accountSid ? '***' + storedCredentials.twilio.accountSid.slice(-4) : '',
        authToken: storedCredentials.twilio.authToken ? '***' : '',
        phoneNumber: storedCredentials.twilio.phoneNumber || ''
      },
      email: {
        host: storedCredentials.email.host || '',
        port: storedCredentials.email.port || 587,
        user: storedCredentials.email.user || '',
        password: storedCredentials.email.password ? '***' : '',
        from: storedCredentials.email.from || ''
      }
    };
    res.json(maskedCredentials);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch credentials' });
  }
});

// POST credentials (update)
router.post('/credentials', (req, res) => {
  try {
    const { twilio, email } = req.body;

    // Validate input
    if (!twilio || !email) {
      return res.status(400).json({ error: 'Invalid credentials format' });
    }

    // Update stored credentials
    storedCredentials = {
      twilio: {
        accountSid: twilio.accountSid || '',
        authToken: twilio.authToken || '',
        phoneNumber: twilio.phoneNumber || ''
      },
      email: {
        host: email.host || '',
        port: email.port || 587,
        user: email.user || '',
        password: email.password || '',
        from: email.from || ''
      }
    };

    // Update config object for use in services
    config.twilio = storedCredentials.twilio;
    config.email = storedCredentials.email;

    res.json({ 
      success: true, 
      message: 'Credentials updated successfully' 
    });
  } catch (error) {
    console.error('Error updating credentials:', error);
    res.status(500).json({ error: 'Failed to update credentials' });
  }
});

// GET current config (for debugging, remove in production)
router.get('/config', (req, res) => {
  try {
    const maskedConfig = {
      twilio: {
        accountSid: config.twilio.accountSid ? '***' + config.twilio.accountSid.slice(-4) : 'not set',
        authToken: config.twilio.authToken ? '***' : 'not set',
        phoneNumber: config.twilio.phoneNumber || 'not set'
      },
      email: {
        host: config.email.host || 'not set',
        port: config.email.port || 'not set',
        user: config.email.user || 'not set',
        password: config.email.password ? '***' : 'not set',
        from: config.email.from || 'not set'
      }
    };
    res.json(maskedConfig);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch config' });
  }
});

export default router;

