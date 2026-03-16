import express from 'express';
import * as smsService from '../services/smsService.js';
import * as emailService from '../services/emailService.js';

const router = express.Router();

// Twilio SMS webhook
router.post('/sms', async (req, res) => {
  try {
    const { From, Body } = req.body;
    
    if (!From || !Body) {
      return res.status(400).json({ error: 'Missing From or Body' });
    }

    const result = await smsService.handleIncomingSMS(From, Body);
    
    // Emit to connected agents via Socket.IO
    // io.emit('new_message', result);
    
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('SMS webhook error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Email webhook
router.post('/email', async (req, res) => {
  try {
    const { from, subject, html, text } = req.body;
    
    if (!from) {
      return res.status(400).json({ error: 'Missing from address' });
    }

    const result = await emailService.handleIncomingEmail(from, subject, html, text);
    
    // Emit to connected agents via Socket.IO
    // io.emit('new_message', result);
    
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Email webhook error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

