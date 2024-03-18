// src/components/ExpenseList.js
import React from 'react';
import ExpenseItem from './ExpenseItem';

function ExpenseList({ expenses, deleteExpense }) {
  return (
    <div>
      <h2>Expense List</h2>
      <ul>
        {expenses.map((expense) => (
          <ExpenseItem key={expense.id} expense={expense} deleteExpense={deleteExpense} />
        ))}
      </ul>
    </div>
  );
}

export default ExpenseList;
