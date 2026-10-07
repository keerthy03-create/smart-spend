function Header({
  totalmoney,
  total,
  remainingMoney,
  transactionCount,
}) {
  return (
    <>
      <header className="header">
        <h1>Smart Spend</h1>
        <p>Manage your expenses and budget in one place</p>
      </header>

      <div className="dashboard">

        <div className="dashboard-card">
          <span>Total Budget</span>
          <h2>₹{totalmoney || 0}</h2>
          <p>Your monthly budget</p>
        </div>

        <div className="dashboard-card">
          <span>Total Spent</span>
          <h2>₹{total}</h2>
          <p>Total expenses</p>
        </div>

        <div className="dashboard-card">
          <span>Remaining</span>
          <h2>₹{remainingMoney}</h2>
          <p>Available balance</p>
        </div>

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