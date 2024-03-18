import React, { useState } from 'react';
import { Button } from '@mui/material';


export const Header = () => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  const [expenses, setExpenses] = useState([]);

  const addExpense = (newExpense) => {
    setExpenses([...expenses, newExpense]);
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    const newExpense = {
      id: Date.now(),
      description,
      amount: parseFloat(amount),
    };
    addExpense(newExpense);
    setDescription('');
    setAmount('');
  };

  const handleDelete = (id) => {
    deleteExpense(id);
  };

  return (
    <>
      <h1>CashTracker</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <button type="submit">Add Expense</button>
      </form>

        <h2>Expense List</h2>
        <ul>
          {expenses.map((expense) => (
            <li key={expense.id}>
              <span>{expense.description}</span>
              <span>${expense.amount}</span>
              <Button onClick={() => handleDelete(expense.id)} variant="contained">
                Delete
              </Button>
            </li>
          ))}
        </ul>
      
    </>
  );
};









  












