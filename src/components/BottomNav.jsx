
import {
  House,
  CirclePlus,
  ReceiptText,
  ChartColumn,
  Wallet,
} from "lucide-react";

function BottomNav({ activeTab, setActiveTab }) {
  const navItems = [
    { id: "home", label: "Home", Icon: House },
    { id: "add", label: "Add", Icon: CirclePlus },
    { id: "expenses", label: "Expenses", Icon: ReceiptText },
    { id: "spending", label: "Spending", Icon: ChartColumn },
    { id: "budget", label: "Budget", Icon: Wallet },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map(({ id, label, Icon }) => (
        <button
          key={id}
          type="button"
          className={`nav-item ${activeTab === id ? "active" : ""}`}
          onClick={() => setActiveTab(id)}
        >
          <Icon />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}

export default BottomNav;
