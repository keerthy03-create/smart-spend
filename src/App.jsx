import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

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
      <Routes>

        {/* ================= DASHBOARD ================= */}

        <Route
          path="/"
          element={
            <div className="app">

              <Header
                totalmoney={totalmoney}
                setTotalmoney={setTotalmoney}
                total={total}
                remainingMoney={remainingMoney}
                transactionCount={transactionCount}
              />

              {/* ================= ADD EXPENSE ================= */}

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

              {/* ================= ANALYTICS ================= */}

              <div className="analytics">

                {/* Spending Overview */}

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

                {/* Budget Status */}

                <div className="analytics-card">

                  <h2>Budget Status</h2>

                  <p>
                    Track your spending against your budget
                  </p>

                  <div className="budget-info">

                    <h3>₹{total}</h3>

                    <span>
                      spent out of ₹{totalmoney || 0}
                    </span>

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
                      ? "Set a budget to track your progress."
                      : actualBudgetPercentage > 100
                      ? "⚠️ You have exceeded your budget."
                      : `${Math.round(
                          actualBudgetPercentage
                        )}% of your budget used`}

                  </p>

                </div>

              </div>

              {/* ================= VIEW EXPENSES ================= */}

              <div style={{ marginBottom: "30px" }}>

                <Link to="/expenses">

                  <button>
                    View All Expenses
                  </button>

                </Link>

              </div>

            </div>
          }
        />

        {/* ================= EXPENSES PAGE ================= */}

        <Route
          path="/expenses"
          element={
            <div className="app">

              <div style={{ marginBottom: "25px" }}>

                <Link to="/">

                  <button>
                    ← Back to Dashboard
                  </button>

                </Link>

              </div>

              <Expenses
                expenses={expenses}
                search={search}
                setSearch={setSearch}
                filterCategory={filterCategory}
                setFilterCategory={setFilterCategory}
                startEdit={startEdit}
                deleteExpense={deleteExpense}
              />

            </div>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;