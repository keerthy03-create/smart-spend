function Expenses({
  expenses,
  search,
  setSearch,
  filterCategory,
  setFilterCategory,
  startEdit,
  deleteExpense,
}) {
  const filteredExpenses = expenses.filter(
    (i) =>
      i.description.toLowerCase().includes(search.toLowerCase()) &&
      (filterCategory === "All" || i.category === filterCategory)
  );

  return (
    <section className="transactions">
      <div className="transaction-header">
        <div>
          <h2>Expenses</h2>
          <p>View and manage all your expenses</p>
        </div>

        <div className="filters">
          <input
            type="text"
            placeholder="Search expenses"
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
          filteredExpenses.map((i, index) => (
            <li key={i.date + i.description + index}>
              <div className="expense-name">
                <strong>{i.description}</strong>
                <span>{i.category}</span>
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

              <div className="expense-amount">
                <strong>₹{i.amount}</strong>
              </div>

              <div className="expense-actions">
                <button onClick={() => startEdit(i)}>Edit</button>
                <button onClick={() => deleteExpense(i)}>Delete</button>
              </div>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}

export default Expenses;