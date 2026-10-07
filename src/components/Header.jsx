import { useState } from "react";

function Header({
  totalmoney,
  setTotalmoney,
  total,
  remainingMoney,
  transactionCount,
}) {
  const [showBudgetInput, setShowBudgetInput] = useState(false);
  const [budgetInput, setBudgetInput] = useState(totalmoney);

  const saveBudget = () => {
    if (!budgetInput || Number(budgetInput) <= 0) {
      alert("Please enter a valid budget amount.");
      return;
    }

    setTotalmoney(budgetInput);
    setShowBudgetInput(false);
  };

  return (
    <>
      <header className="header">
        <h1>Smart Spend</h1>
        <p>Manage your expenses and budget in one place</p>
      </header>

      <div className="dashboard">

        {/* Total Budget */}
        <div className="dashboard-card">
          <span>Total Budget</span>

          <h2>₹{totalmoney || 0}</h2>

          {showBudgetInput ? (
            <div className="budget-input-card">
              <input
                type="number"
                placeholder="Enter budget"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
              />

              <button onClick={saveBudget}>
                Save
              </button>
            </div>
          ) : (
            <button
              className="set-budget-button"
              onClick={() => {
                setBudgetInput(totalmoney);
                setShowBudgetInput(true);
              }}
            >
              {totalmoney ? "Edit Budget" : "Set Budget"}
            </button>
          )}

          <p>Your monthly budget</p>
        </div>

        {/* Total Spent */}
        <div className="dashboard-card">
          <span>Total Spent</span>
          <h2>₹{total}</h2>
          <p>Total expenses</p>
        </div>

        {/* Remaining */}
        <div className="dashboard-card">
          <span>Remaining</span>
          <h2>₹{remainingMoney}</h2>
          <p>Available balance</p>
        </div>

        {/* Transactions */}
        <div className="dashboard-card">
          <span>Transactions</span>
          <h2>{transactionCount}</h2>
          <p>Total transactions</p>
        </div>

      </div>
    </>
  );
}

export default Header;