import { useState, useEffect } from "react";
import "./App.css";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import Header from "./components/Header";
import AddExpense from "./components/AddExpense";
import BudgetManagement from "./components/BudgetManagement";

function App() {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");

  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = localStorage.getItem("expenses");

    if (savedExpenses) {
      return JSON.parse(savedExpenses);
    }

    return [];
  });

  const transactionCount = expenses.length;

  const [totalmoney, setTotalmoney] = useState(() => {
    const savedBudget = localStorage.getItem("budget");

    if (savedBudget) {
      return savedBudget;
    }

    return "";
  });

  const [date, setDate] = useState("");
  const [editExpense, setEditExpense] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem("budget", totalmoney);
  }, [totalmoney]);

  const clearForm = () => {
    setDescription("");
    setAmount("");
    setCategory("Food");
    setDate("");
    setEditExpense(null);
  };

  const updateExpense = () => {
    if (!description || !amount || Number(amount) <= 0 || !date) {
      alert("Please enter a valid description, amount, and date.");
      return;
    }

    const updatedExpenses = expenses.map((i) => {
      if (i === editExpense) {
        return {
          description,
          amount,
          category,
          date,
        };
      }

      return i;
    });

    setExpenses(updatedExpenses);
    clearForm();
  };

  const addExpense = () => {
    if (!description || !amount || Number(amount) <= 0 || !date) {
      alert("Please enter a valid description, amount, and date.");
      return;
    }

    const newExpense = {
      description,
      amount,
      category,
      date,
    };

    setExpenses([...expenses, newExpense]);
    clearForm();
  };

  const deleteExpense = (i) => {
    const updated = expenses.filter((j) => {
      return j !== i;
    });

    setExpenses(updated);
  };

  const startEdit = (i) => {
    setDescription(i.description);
    setAmount(i.amount);
    setCategory(i.category);
    setDate(i.date);
    setEditExpense(i);
  };

  const total = expenses.reduce((total, a) => {
    return total + Number(a.amount);
  }, 0);

  const remainingMoney = Number(totalmoney) - total;

  const categoryTotals = expenses.reduce((acc, i) => {
    if (acc[i.category]) {
      acc[i.category] += Number(i.amount);
    } else {
      acc[i.category] = Number(i.amount);
    }

    return acc;
  }, {});

  const chartData = Object.entries(categoryTotals).map(
    ([category, amount]) => ({
      category,
      amount,
    })
  );

  const filteredExpenses = expenses.filter(
    (i) =>
      i.description.toLowerCase().includes(search.toLowerCase()) &&
      (filterCategory === "All" || i.category === filterCategory)
  );

  const budgetPercentage = totalmoney
    ? Math.min((total / Number(totalmoney)) * 100, 100)
    : 0;

  const actualBudgetPercentage = totalmoney
    ? (total / Number(totalmoney)) * 100
    : 0;

  return (
    <div className="app">

      {/* Header + Dashboard */}
      <Header
        totalmoney={totalmoney}
        total={total}
        remainingMoney={remainingMoney}
        transactionCount={transactionCount}
      />

      {/* Add Expense */}
      <AddExpense
        date={date}
        setDate={setDate}
        description={description}
        setDescription={setDescription}
        amount={amount}
        setAmount={setAmount}
        category={category}
        setCategory={setCategory}
        editExpense={editExpense}
        updateExpense={updateExpense}
        addExpense={addExpense}
      />

      {/* Analytics */}
      <div className="analytics">

        <div className="analytics-card">
          <h2>Spending Overview</h2>
          <p>Track where your money is going</p>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="analytics-card">
          <h2>Budget Status</h2>
          <p>Monitor your remaining balance</p>

          <div className="budget-info">
            <h3>₹{remainingMoney}</h3>
            <span>Remaining money</span>
          </div>

          <div className="progress-bar">
            <div
              className="progress"
              style={{
                width: `${budgetPercentage}%`,
              }}
            ></div>
          </div>

          <p>
            {totalmoney === ""
              ? "Set a budget to track your spending"
              : remainingMoney < 0
              ? `${Math.round(
                  actualBudgetPercentage
                )}% of your budget used - ⚠️ Budget exceeded`
              : remainingMoney === 0
              ? "⚠️ Budget fully used"
              : "✅ You are within your budget"}
          </p>
        </div>

      </div>

      {/* Transactions */}
      <section className="transactions">

        <div className="transaction-header">

          <div>
            <h2>Recent Transactions</h2>
            <p>Your latest expenses</p>
          </div>

          <div className="filters">

            <input
              type="search"
              placeholder="Search expenses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option>All</option>
              <option>Food</option>
              <option>Transport</option>
              <option>Skincare</option>
              <option>Clothes</option>
              <option>Accessories</option>
            </select>

          </div>

        </div>

        <ul>
          {filteredExpenses.length === 0 ? (
            <li className="empty-message">
              {expenses.length === 0
                ? "No expenses added yet."
                : "No matching expenses found."}
            </li>
          ) : (
            filteredExpenses.map((i) => (
              <li key={i.date + i.description}>

                <div className="expense-name">
                  <strong>{i.description}</strong>
                  <span>{i.category}</span>
                </div>

                <div className="expense-amount">
                  <strong>₹{i.amount}</strong>
                </div>

                <div className="expense-date">
                  <span>
                    {new Date(i.date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div className="expense-actions">
                  <button onClick={() => startEdit(i)}>
                    Edit
                  </button>

                  <button onClick={() => deleteExpense(i)}>
                    Delete
                  </button>
                </div>

              </li>
            ))
          )}
        </ul>

      </section>

      {/* Budget Management */}
      <BudgetManagement
        totalmoney={totalmoney}
        setTotalmoney={setTotalmoney}
        remainingMoney={remainingMoney}
      />

    </div>
  );
}

export default App;