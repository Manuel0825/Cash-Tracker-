// src/components/TotalExpense.js
import React from 'react';

function TotalExpense({ expenses }) {
  const total = expenses.reduce((acc, expense) => acc + expense.amount, 0);

  return (
    <div>
      <h2>Total Expense: ${total}</h2>
    </div>
  );
}

export default TotalExpense;
