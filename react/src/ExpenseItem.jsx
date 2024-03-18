// src/components/ExpenseItem.js
import React from 'react';

function ExpenseItem({ expense, deleteExpense }) {
  const { id, description, amount } = expense;

  const handleDelete = () => {
    deleteExpense(id);
  };

  return (
    <li>
      <span>{description}</span>
      <span>${amount}</span>
      <button onClick={handleDelete}>Delete</button>
    </li>
  );
}

export default ExpenseItem;
