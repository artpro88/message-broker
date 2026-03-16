import nodemailer from 'nodemailer';
import config from '../config.js';
import * as customerService from './customerService.js';
import * as conversationService from './conversationService.js';

// Create transporter dynamically based on current config
const getTransporter = () => {
  return nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.port === 465, // Use secure for port 465, not 587
    auth: {
      user: config.email.user,
      pass: config.email.password
    }
  });
};

export const sendEmail = async (toEmail, subject, htmlContent, textContent) => {
  try {
    if (!config.email.host || !config.email.user || !config.email.password) {
      throw new Error('Email configuration is incomplete. Please configure email settings.');
    }

    const transporter = getTransporter();
    const result = await transporter.sendMail({
      from: config.email.from,
      to: toEmail,
      subject,
      html: htmlContent,
      text: textContent
    });
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export const handleIncomingEmail = async (fromEmail, subject, htmlContent, textContent) => {
  try {
    // Extract customer ID or username from subject if present
    const subjectMatch = subject.match(/\[ID:(\d+)\]/) || subject.match(/\[USER:(\w+)\]/);
    let customer = null;

    if (subjectMatch) {
      const identifier = subjectMatch[1];
      customer = isNaN(identifier) 
        ? await customerService.findCustomerByUsername(identifier)
        : await customerService.findCustomerById(parseInt(identifier));
    }

    // Fallback to email lookup
    if (!customer) {
      customer = await customerService.getOrCreateCustomer(fromEmail, null, null);
    }

    // Get or create conversation
    let conversation = await conversationService.getConversationByCustomerId(customer.id);
    if (!conversation) {
      conversation = await conversationService.createConversation(customer.id, 'email');
    } else {
      await conversationService.updateConversationChannel(conversation.id, 'email');
    }

    // Add message to conversation
    const message = await conversationService.addMessage(
      conversation.id,
      'email',
      'incoming',
      customer.id,
      htmlContent || textContent
    );

    return { customer, conversation, message };
  } catch (error) {
    console.error('Error handling incoming email:', error);
    throw error;
  }
};

export const sendEmailReply = async (conversationId, customerId, subject, htmlContent, textContent) => {
  try {
    const customer = await customerService.findCustomerById(customerId);
    if (!customer || !customer.email) {
      throw new Error('Customer email not found');
    }

    await sendEmail(customer.email, subject, htmlContent, textContent);

    const message = await conversationService.addMessage(
      conversationId,
      'email',
      'outgoing',
      null,
      htmlContent || textContent
    );

    return message;
  } catch (error) {
    console.error('Error sending email reply:', error);
    throw error;
  }
};

