import { useState } from "react";
import axios from "axios";

export default function AddExpense({ group, onExpenseAdded }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [splitType, setSplitType] = useState("equal");
  const [splits, setSplits] = useState([]); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      description,
      amount: parseFloat(amount),
      paid_by: parseInt(paidBy),
      split_type: splitType,
    };

    if (splitType === "percentage") {
      payload.splits = splits.map((s) => ({
        user_id: parseInt(s.user_id),
        percentage: parseFloat(s.percentage),
      }));
    }

    try {
      await axios.post(`http://127.0.0.1:8000/groups/${group.id}/expenses`, payload);
      alert("Expense added");
      onExpenseAdded(); // refresh if needed
      setDescription("");
      setAmount("");
    } catch (err) {
      console.error(err);
      alert("Failed to add expense");
    }
  };

  return (
    <div className="my-4 p-4 border rounded">
      <h2 className="text-lg font-bold mb-2">Add Expense for {group.name}</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="border p-2 mr-2 mb-2"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          className="border p-2 mr-2 mb-2"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <select
          className="border p-2 mr-2 mb-2"
          value={paidBy}
          onChange={(e) => setPaidBy(e.target.value)}
        >
          <option value="">Paid By</option>
          {group.users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>

        <select
          className="border p-2 mr-2 mb-2"
          value={splitType}
          onChange={(e) => setSplitType(e.target.value)}
        >
          <option value="equal">Split Equally</option>
          <option value="percentage">Split by %</option>
        </select>

        {splitType === "percentage" &&
          group.users.map((user) => (
            <div key={user.id} className="mb-1">
              <label>
                {user.name} %
                <input
                  type="number"
                  className="border ml-2 p-1 w-20"
                  onChange={(e) =>
                    setSplits((prev) =>
                      [
                        ...prev.filter((s) => s.user_id !== user.id),
                        {
                          user_id: user.id,
                          percentage: parseFloat(e.target.value),
                        },
                      ]
                    )
                  }
                />
              </label>
            </div>
          ))}

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
        >
          Add Expense
        </button>
      </form>
    </div>
  );
}
