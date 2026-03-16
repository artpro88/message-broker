import dotenv from 'dotenv';

dotenv.config();

const config = {
  // Server
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  instanceName: process.env.INSTANCE_NAME || 'default',

  // Database
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    name: process.env.DB_NAME || 'message_broker',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password'
  },

  // Twilio
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER
  },

  // Email
  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || 587,
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_key',
    expiry: process.env.JWT_EXPIRY || '24h'
  },

  // Live Chat
  liveChat: {
    enabled: process.env.LIVECHAT_ENABLED === 'true',
    greeting: process.env.LIVECHAT_GREETING || 'Hello! How can we help you today?'
  },

  // Customer Data API
  customerApi: {
    url: process.env.CUSTOMER_API_URL,
    key: process.env.CUSTOMER_API_KEY
  },

  // Snowflake (optional)
  snowflake: {
    account: process.env.SNOWFLAKE_ACCOUNT,
    user: process.env.SNOWFLAKE_USER,
    password: process.env.SNOWFLAKE_PASSWORD,
    database: process.env.SNOWFLAKE_DATABASE,
    schema: process.env.SNOWFLAKE_SCHEMA
  }
};

export default config;

