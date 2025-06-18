import { useEffect, useState } from "react";
import axios from "axios";

export default function GroupBalances({ groupId }) {
  const [balances, setBalances] = useState([]);

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/groups/${groupId}/balances`);
        setBalances(res.data);
      } catch (err) {
        console.error("Failed to fetch balances", err);
      }
    };

    fetchBalances();
  }, [groupId]);

  if (balances.length === 0) return null;

  return (
    <div className="mt-2 p-2 bg-gray-50 rounded border">
      <h3 className="font-semibold text-sm mb-1 text-gray-700">Balances:</h3>
      <ul className="text-sm text-gray-800">
        {balances.map((entry, idx) => (
          <li key={idx}>
            {entry.from} owes {entry.to}: ₹{entry.amount}
          </li>
        ))}
      </ul>
    </div>
  );
}
