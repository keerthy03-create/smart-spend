import { Link } from "react-router-dom";

function AddExpense({
  date,
  setDate,
  description,
  setDescription,
  amount,
  setAmount,
  category,
  setCategory,
  editExpense,
  updateExpense,
  addExpense,
}) {
  return (
    <section className="expense-form">
      <h2>{editExpense ? "Update Expense" : "Add Expense"}</h2>

      <div className="input-container">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <input
          type="text"
          placeholder="Enter Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="number"
          placeholder="Enter Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>Food</option>
          <option>Transport</option>
          <option>Skincare</option>
          <option>Clothes</option>
          <option>Accessories</option>
        </select>

        <button onClick={editExpense ? updateExpense : addExpense}>
          {editExpense ? "Update Expense" : "Add Expense"}
        </button>
      </div>

      <div className="view-expenses-container">
        <Link to="/expenses">
          <button className="view-expenses-button">
            View All Expenses
          </button>
        </Link>
      </div>
    </section>
  );
}

export default AddExpense;