import nodemailer from 'nodemailer';
import * as customerService from './customerService.js';
import * as conversationService from './conversationService.js';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export const sendEmail = async (toEmail, subject, htmlContent, textContent) => {
  try {
    const result = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
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

