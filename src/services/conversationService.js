import { query } from '../db.js';

export const getConversationByCustomerId = async (customerId) => {
  const result = await query(
    `SELECT * FROM conversations 
     WHERE customer_id = $1 AND status != 'closed'
     ORDER BY updated_at DESC
     LIMIT 1`,
    [customerId]
  );
  return result.rows[0];
};

export const createConversation = async (customerId, channel) => {
  const result = await query(
    `INSERT INTO conversations (customer_id, last_channel, status)
     VALUES ($1, $2, 'open')
     RETURNING *`,
    [customerId, channel]
  );
  return result.rows[0];
};

export const updateConversationChannel = async (conversationId, channel) => {
  const result = await query(
    `UPDATE conversations 
     SET last_channel = $1, updated_at = CURRENT_TIMESTAMP
     WHERE id = $2
     RETURNING *`,
    [channel, conversationId]
  );
  return result.rows[0];
};

export const getConversationMessages = async (conversationId) => {
  const result = await query(
    `SELECT m.*, a.file_name, a.file_path, a.mime_type
     FROM messages m
     LEFT JOIN attachments a ON m.attachment_id = a.id
     WHERE m.conversation_id = $1
     ORDER BY m.created_at ASC`,
    [conversationId]
  );
  return result.rows;
};

export const addMessage = async (conversationId, channel, direction, senderId, message, attachmentId = null) => {
  const result = await query(
    `INSERT INTO messages (conversation_id, channel, direction, sender_id, message, attachment_id)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [conversationId, channel, direction, senderId, message, attachmentId]
  );
  return result.rows[0];
};

export const lockConversation = async (conversationId, agentId) => {
  const result = await query(
    `UPDATE conversations 
     SET locked_by_agent = TRUE, assigned_agent_id = $1, updated_at = CURRENT_TIMESTAMP
     WHERE id = $2
     RETURNING *`,
    [agentId, conversationId]
  );
  return result.rows[0];
};

export const unlockConversation = async (conversationId) => {
  const result = await query(
    `UPDATE conversations 
     SET locked_by_agent = FALSE, updated_at = CURRENT_TIMESTAMP
     WHERE id = $1
     RETURNING *`,
    [conversationId]
  );
  return result.rows[0];
};

export const closeConversation = async (conversationId) => {
  const result = await query(
    `UPDATE conversations 
     SET status = 'closed', updated_at = CURRENT_TIMESTAMP
     WHERE id = $1
     RETURNING *`,
    [conversationId]
  );
  return result.rows[0];
};

