import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import BottomNav from "./components/BottomNav";

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
import Expenses from "./pages/Expenses";

function App() {
  // ================= FORM STATES =================

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState("");
  const [activeTab, setActiveTab] = useState("home");

  // ================= EXPENSES =================

  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = localStorage.getItem("expenses");

    if (savedExpenses) {
      return JSON.parse(savedExpenses);
    }

    return [];
  });

  // ================= BUDGET =================

  const [totalmoney, setTotalmoney] = useState(() => {
    const savedBudget = localStorage.getItem("budget");

    if (savedBudget) {
      return savedBudget;
    }

    return "";
  });

  // ================= EDIT =================

  const [editExpense, setEditExpense] = useState(null);

  // ================= SEARCH & FILTER =================

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  // ================= SAVE EXPENSES =================

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  // ================= SAVE BUDGET =================

  useEffect(() => {
    localStorage.setItem("budget", totalmoney);
  }, [totalmoney]);

  // ================= CLEAR FORM =================

  const clearForm = () => {
    setDescription("");
    setAmount("");
    setCategory("Food");
    setDate("");
    setEditExpense(null);
  };

  // ================= ADD EXPENSE =================

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

  // ================= START EDIT =================


const startEdit = (expense) => {
  setDescription(expense.description);
  setAmount(expense.amount);
  setCategory(expense.category);
  setDate(expense.date);
  setEditExpense(expense);

  setActiveTab("add");
};


  // ================= UPDATE EXPENSE =================

  const updateExpense = () => {
    if (!description || !amount || Number(amount) <= 0 || !date) {
      alert("Please enter a valid description, amount, and date.");
      return;
    }

    const updatedExpenses = expenses.map((expense) => {
      if (expense === editExpense) {
        return {
          description,
          amount,
          category,
          date,
        };
      }

      return expense;
    });

    setExpenses(updatedExpenses);

    clearForm();
  };

  // ================= DELETE EXPENSE =================

  const deleteExpense = (expenseToDelete) => {
    const updatedExpenses = expenses.filter(
      (expense) => expense !== expenseToDelete
    );

    setExpenses(updatedExpenses);
  };

  // ================= TOTAL SPENDING =================

  const total = expenses.reduce((total, expense) => {
    return total + Number(expense.amount);
  }, 0);

  // ================= TRANSACTION COUNT =================

  const transactionCount = expenses.length;

  // ================= REMAINING MONEY =================

  const remainingMoney = Number(totalmoney) - total;

  // ================= CATEGORY TOTALS =================

  const categoryTotals = expenses.reduce((acc, expense) => {
    if (acc[expense.category]) {
      acc[expense.category] += Number(expense.amount);
    } else {
      acc[expense.category] = Number(expense.amount);
    }

    return acc;
  }, {});

  // ================= CHART DATA =================

  const chartData = Object.entries(categoryTotals).map(
    ([category, amount]) => ({
      category,
      amount,
    })
  );
  const recentExpenses = [...expenses]
  .sort((a, b) => new Date(b.date) - new Date(a.date))
  .slice(0, 2);

  // ================= BUDGET PERCENTAGE =================

  const budgetPercentage = totalmoney
    ? Math.min((total / Number(totalmoney)) * 100, 100)
    : 0;

  const actualBudgetPercentage = totalmoney
    ? (total / Number(totalmoney)) * 100
    : 0;

  // ================= RETURN =================


return (
  <BrowserRouter>
    <div className="app">
      {activeTab === "home" && (
        <>
          <Header
            totalmoney={totalmoney}
            setTotalmoney={setTotalmoney}
            total={total}
            remainingMoney={remainingMoney}
            transactionCount={transactionCount}
          />

          <section className="recent-transactions">
            <div className="recent-transactions-header">
              <h2>Recent Transactions</h2>
            </div>

            {recentExpenses.length === 0 ? (
              <div className="empty-message">
                No transactions yet.
              </div>
            ) : (
              <ul>
                {recentExpenses.map((expense, index) => (
                  <li key={expense.date + expense.description + index}>
                    <div className="recent-expense-name">
                      <strong>{expense.description}</strong>
                      <span>{expense.category}</span>
                    </div>

                    <div className="recent-expense-date">
                      {new Date(expense.date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>

                    <div className="recent-expense-amount">
                      ₹{expense.amount}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}

      {activeTab === "add" && (
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
          setActiveTab={setActiveTab}
        />
      )}

      {activeTab === "expenses" && (
        <Expenses
          expenses={expenses}
          search={search}
          setSearch={setSearch}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          startEdit={startEdit}
          deleteExpense={deleteExpense}
        />
      )}

      {activeTab === "spending" && (
        <div className="analytics-card">
          <h2>Spending Overview</h2>
          <p>Category-wise expense analysis</p>

          {chartData.length === 0 ? (
            <div className="empty-message">
              No spending data available yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      )}

      {activeTab === "budget" && (
        <div className="analytics-card">
          <h2>Budget Status</h2>
          <p>Track your spending against your budget</p>

          <div className="budget-info">
            <h3>₹{total}</h3>
            <span>spent out of ₹{totalmoney || 0}</span>
          </div>

          <div className="progress-bar">
            <div
              className="progress"
              style={{ width: `${budgetPercentage}%` }}
            />
          </div>

          <p>
            {totalmoney === ""
              ? "Set a budget to track your progress."
              : actualBudgetPercentage > 100
              ? "⚠️ You have exceeded your budget."
              : `${Math.round(actualBudgetPercentage)}% of your budget used`}
          </p>

          <button
            onClick={() => setActiveTab("home")}
          >
            Back to Home
          </button>
        </div>
      )}

      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  </BrowserRouter>
);

}
export default App;