import express from 'express';
import * as customerService from '../services/customerService.js';

const router = express.Router();

// Get customer by ID
router.get('/:id', async (req, res) => {
  try {
    const customer = await customerService.findCustomerById(parseInt(req.params.id));
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get customer by email
router.get('/email/:email', async (req, res) => {
  try {
    const customer = await customerService.findCustomerByEmail(req.params.email);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get customer by phone
router.get('/phone/:phone', async (req, res) => {
  try {
    const customer = await customerService.findCustomerByPhone(req.params.phone);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create customer
router.post('/', async (req, res) => {
  try {
    const customer = await customerService.createCustomer(req.body);
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update customer
router.put('/:id', async (req, res) => {
  try {
    const customer = await customerService.updateCustomer(parseInt(req.params.id), req.body);
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

