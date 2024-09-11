import React from 'react';
import "./style.css";
import { Button, Card, Row } from "antd";

function Cards({ income, expense, totalBalance, showExpenseModal, showIncomeModal }) {
  return (
    <div>
      <Row className='my-row'>
        <Card bordered={true} className='my-card'>
          <h2 title="Current Balance">Current Balance</h2>
          <p>₹{totalBalance}</p>
          <Button type="primary" onClick={() => alert('Reset Balance Clicked')}>Reset Balance</Button>
        </Card>

        <Card bordered={true} className='my-card'>
          <h2 title="Total Income">Total Income</h2>
          <p>₹{income}</p>
          <Button type="primary" onClick={showIncomeModal}>Add Income</Button>
        </Card>

        <Card bordered={true} className='my-card'>
          <h2 title="Total Expenses">Total Expenses</h2>
          <p>₹{expense}</p>
          <Button  type="primary" onClick={showExpenseModal}>Add Expense</Button>
        </Card>
      </Row>
    </div>
  );
}

export default Cards;
