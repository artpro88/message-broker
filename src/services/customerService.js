import { query } from '../db.js';

export const findCustomerByEmail = async (email) => {
  const result = await query(
    'SELECT * FROM customers WHERE email = $1',
    [email]
  );
  return result.rows[0];
};

export const findCustomerByPhone = async (phone) => {
  const result = await query(
    'SELECT * FROM customers WHERE phone = $1',
    [phone]
  );
  return result.rows[0];
};

export const findCustomerByUsername = async (username) => {
  const result = await query(
    'SELECT * FROM customers WHERE username = $1',
    [username]
  );
  return result.rows[0];
};

export const findCustomerById = async (id) => {
  const result = await query(
    'SELECT * FROM customers WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

export const createCustomer = async (customerData) => {
  const { user_id, username, email, phone, first_name, last_name } = customerData;
  const result = await query(
    `INSERT INTO customers (user_id, username, email, phone, first_name, last_name)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [user_id, username, email, phone, first_name, last_name]
  );
  return result.rows[0];
};

export const updateCustomer = async (id, customerData) => {
  const fields = [];
  const values = [];
  let paramCount = 1;

  Object.entries(customerData).forEach(([key, value]) => {
    fields.push(`${key} = $${paramCount}`);
    values.push(value);
    paramCount++;
  });

  values.push(id);
  const result = await query(
    `UPDATE customers SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
     WHERE id = $${paramCount}
     RETURNING *`,
    values
  );
  return result.rows[0];
};

export const getOrCreateCustomer = async (email, phone, username) => {
  let customer = null;

  if (email) customer = await findCustomerByEmail(email);
  if (!customer && phone) customer = await findCustomerByPhone(phone);
  if (!customer && username) customer = await findCustomerByUsername(username);

  if (!customer) {
    customer = await createCustomer({ email, phone, username });
  }

  return customer;
};

