import express from 'express';
import * as conversationService from '../services/conversationService.js';
import * as customerService from '../services/customerService.js';
import * as smsService from '../services/smsService.js';
import * as emailService from '../services/emailService.js';
import * as liveChatService from '../services/liveChatService.js';

const router = express.Router();

// Get all conversations for a customer
router.get('/customer/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    const conversation = await conversationService.getConversationByCustomerId(parseInt(customerId));
    
    if (!conversation) {
      return res.status(404).json({ error: 'No active conversation found' });
    }

    const messages = await conversationService.getConversationMessages(conversation.id);
    res.json({ conversation, messages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get conversation details
router.get('/:conversationId', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await conversationService.getConversationMessages(parseInt(conversationId));
    res.json({ messages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send reply via SMS
router.post('/:conversationId/reply/sms', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { customerId, message } = req.body;
    
    const result = await smsService.sendSMSReply(parseInt(conversationId), parseInt(customerId), message);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send reply via Email
router.post('/:conversationId/reply/email', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { customerId, subject, htmlContent, textContent } = req.body;
    
    const result = await emailService.sendEmailReply(
      parseInt(conversationId),
      parseInt(customerId),
      subject,
      htmlContent,
      textContent
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send reply via Live Chat
router.post('/:conversationId/reply/livechat', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { customerId, message } = req.body;
    
    const result = await liveChatService.sendLiveChatReply(
      parseInt(conversationId),
      parseInt(customerId),
      message
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Lock conversation
router.post('/:conversationId/lock', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { agentId } = req.body;
    
    const result = await conversationService.lockConversation(parseInt(conversationId), parseInt(agentId));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Unlock conversation
router.post('/:conversationId/unlock', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const result = await conversationService.unlockConversation(parseInt(conversationId));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Close conversation
router.post('/:conversationId/close', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const result = await conversationService.closeConversation(parseInt(conversationId));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

