import twilio from 'twilio';
import * as customerService from './customerService.js';
import * as conversationService from './conversationService.js';

// Initialize Twilio client only if credentials are provided
let twilioClient = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
}

export const sendSMS = async (toPhone, message) => {
  try {
    if (!twilioClient) {
      console.warn('Twilio client not configured. SMS not sent.');
      return { success: false, message: 'Twilio not configured' };
    }
    const result = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: toPhone
    });
    return result;
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
};

export const handleIncomingSMS = async (fromPhone, messageText) => {
  try {
    // Find or create customer
    const customer = await customerService.getOrCreateCustomer(null, fromPhone, null);

    // Get or create conversation
    let conversation = await conversationService.getConversationByCustomerId(customer.id);
    if (!conversation) {
      conversation = await conversationService.createConversation(customer.id, 'sms');
    } else {
      await conversationService.updateConversationChannel(conversation.id, 'sms');
    }

    // Add message to conversation
    const message = await conversationService.addMessage(
      conversation.id,
      'sms',
      'incoming',
      customer.id,
      messageText
    );

    return { customer, conversation, message };
  } catch (error) {
    console.error('Error handling incoming SMS:', error);
    throw error;
  }
};

export const sendSMSReply = async (conversationId, customerId, messageText) => {
  try {
    const customer = await customerService.findCustomerById(customerId);
    if (!customer || !customer.phone) {
      throw new Error('Customer phone number not found');
    }

    await sendSMS(customer.phone, messageText);

    const message = await conversationService.addMessage(
      conversationId,
      'sms',
      'outgoing',
      null,
      messageText
    );

    return message;
  } catch (error) {
    console.error('Error sending SMS reply:', error);
    throw error;
  }
};

