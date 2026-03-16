import React from 'react';
import './CustomerInfo.css';

function CustomerInfo({ customer }) {
  return (
    <div className="customer-info">
      <div className="info-header">
        <h3>Customer Info</h3>
      </div>

      <div className="info-section">
        <div className="info-row">
          <label>Name:</label>
          <span>{customer.first_name} {customer.last_name}</span>
        </div>
        <div className="info-row">
          <label>Username:</label>
          <span>{customer.username || 'N/A'}</span>
        </div>
        <div className="info-row">
          <label>Email:</label>
          <span>{customer.email || 'N/A'}</span>
        </div>
        <div className="info-row">
          <label>Phone:</label>
          <span>{customer.phone || 'N/A'}</span>
        </div>
      </div>

      <div className="info-section">
        <h4>Account Details</h4>
        <div className="info-row">
          <label>Balance:</label>
          <span className="balance">${customer.balance?.toFixed(2) || '0.00'}</span>
        </div>
        <div className="info-row">
          <label>Bet Limit:</label>
          <span>${customer.bet_limit?.toFixed(2) || 'N/A'}</span>
        </div>
        <div className="info-row">
          <label>Lifetime Bets:</label>
          <span>${customer.lifetime_bets?.toFixed(2) || '0.00'}</span>
        </div>
      </div>

      <div className="info-section">
        <h4>Revenue</h4>
        <div className="info-row">
          <label>Sports:</label>
          <span>${customer.sports_revenue?.toFixed(2) || '0.00'}</span>
        </div>
        <div className="info-row">
          <label>Casino:</label>
          <span>${customer.casino_revenue?.toFixed(2) || '0.00'}</span>
        </div>
      </div>

      <div className="info-section">
        <h4>Metadata</h4>
        <div className="info-row">
          <label>Segment:</label>
          <span>{customer.segment || 'N/A'}</span>
        </div>
        <div className="info-row">
          <label>Affiliate:</label>
          <span>{customer.affiliate_tag || 'N/A'}</span>
        </div>
        <div className="info-row">
          <label>Joined:</label>
          <span>{new Date(customer.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}

export default CustomerInfo;

