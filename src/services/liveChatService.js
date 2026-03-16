import jwt from 'jsonwebtoken';
import { query } from '../db.js';
import * as customerService from './customerService.js';
import * as conversationService from './conversationService.js';

export const verifyJWT = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
};

export const createLiveChatSession = async (customerId, jwtId) => {
  const result = await query(
    `INSERT INTO livechat_sessions (customer_id, jwt_id)
     VALUES ($1, $2)
     RETURNING *`,
    [customerId, jwtId]
  );
  return result.rows[0];
};

export const endLiveChatSession = async (sessionId) => {
  const result = await query(
    `UPDATE livechat_sessions 
     SET ended_at = CURRENT_TIMESTAMP
     WHERE id = $1
     RETURNING *`,
    [sessionId]
  );
  return result.rows[0];
};

export const handleLiveChatMessage = async (jwtPayload, messageText) => {
  try {
    const { userId, username, email } = jwtPayload;

    // Find or create customer
    let customer = null;
    if (userId) {
      customer = await customerService.findCustomerById(userId);
    }
    if (!customer && email) {
      customer = await customerService.getOrCreateCustomer(email, null, username);
    }
    if (!customer && username) {
      customer = await customerService.getOrCreateCustomer(null, null, username);
    }

    if (!customer) {
      customer = await customerService.createCustomer({
        user_id: userId,
        username,
        email
      });
    }

    // Get or create conversation
    let conversation = await conversationService.getConversationByCustomerId(customer.id);
    if (!conversation) {
      conversation = await conversationService.createConversation(customer.id, 'livechat');
    } else {
      await conversationService.updateConversationChannel(conversation.id, 'livechat');
    }

    // Add message to conversation
    const message = await conversationService.addMessage(
      conversation.id,
      'livechat',
      'incoming',
      customer.id,
      messageText
    );

    return { customer, conversation, message };
  } catch (error) {
    console.error('Error handling live chat message:', error);
    throw error;
  }
};

export const sendLiveChatReply = async (conversationId, customerId, messageText) => {
  try {
    const message = await conversationService.addMessage(
      conversationId,
      'livechat',
      'outgoing',
      null,
      messageText
    );

    return message;
  } catch (error) {
    console.error('Error sending live chat reply:', error);
    throw error;
  }
};

