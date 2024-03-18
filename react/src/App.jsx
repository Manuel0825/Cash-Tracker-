// src/App.js
import React, { useState } from 'react';
import Header from './Header';
import ExpenseList from './ExpenseList';
import AddExpenseForm from './AddExpenseForm';
import TotalExpense from './TotalExpense';

function App() {
  const [expenses, setExpenses] = useState([]);

  const addExpense = (newExpense) => {
    setExpenses([...expenses, newExpense]);
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  return (
    <div className="App">
      <Header />
      <AddExpenseForm addExpense={addExpense} />
      <ExpenseList expenses={expenses} deleteExpense={deleteExpense} />
      <TotalExpense expenses={expenses} />
    </div>
  );
}

export default App;
