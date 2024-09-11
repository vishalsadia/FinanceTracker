import React from 'react';
import { Line, Pie } from '@ant-design/charts';

function ChartComponent({ sortedTransactions }) {
  const data = sortedTransactions.map((item) => ({
    date: item.date,
    amount: item.amount,
  }));

  const SpendingData = sortedTransactions
    .filter((transaction) => transaction.type === 'expense')
    .map((transaction) => ({
      tag: transaction.tag,
      amount: transaction.amount,
    }));

  // Define default spending categories
  const newSpendings = [
    { tag: 'food', amount: 0 },
    { tag: 'education', amount: 0 },
    { tag: 'office', amount: 0 },
  ];

  // Accumulate spending amounts into predefined categories
  SpendingData.forEach((item) => {
    const found = newSpendings.find(spend => spend.tag === item.tag);
    if (found) {
      found.amount += item.amount;
    }
  });

  const config = {
    data,
    width: 500,
    height: 400,
    xField: 'date',
    yField: 'amount',
  };

  const spendingConfig = {
    data: newSpendings,
    width: 500,
    height: 400,
    angleField: 'amount',
    colorField: 'tag',
  };

  return (
    <div className='charts-wrapper'>
      <div>
        <h2 style={{ marginTop: 0 }}>Your Analytics</h2>
        <Line {...config} />
      </div>

      <div>
        <h2>Your Spendings</h2>
        <Pie {...spendingConfig} />
      </div>
    </div>
  );
}

export default ChartComponent;
