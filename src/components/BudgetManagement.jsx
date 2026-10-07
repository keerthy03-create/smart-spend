function BudgetManagement({
  totalmoney,
  setTotalmoney,
  remainingMoney,
}) {
  return (
    <section className="budget-section">
      <h2>Budget Management</h2>

      <input
        type="number"
        placeholder="Enter Total Money"
        value={totalmoney}
        onChange={(e) => setTotalmoney(e.target.value)}
      />

      <p>Remaining Money: ₹{remainingMoney}</p>

      {totalmoney === "" ? (
        <p></p>
      ) : remainingMoney < 0 ? (
        <p>⚠️ Budget Exceeded!</p>
      ) : remainingMoney === 0 ? (
        <p>⚠️ You have used your entire budget!</p>
      ) : (
        <p>✅ You are within your budget.</p>
      )}
    </section>
  );
}

export default BudgetManagement;