import { useState, useEffect } from "react";
import GroupForm from "../components/GroupForm";
import GroupBalances from "../components/GroupBalances";
import AddExpense from "../components/AddExpense"; 
import axios from "axios";
import ChatBot from "../components/ChatBot";

export default function Home() {
  const [groups, setGroups] = useState([]);

  const createGroup = ({ id, name, users }) => {
    setGroups([...groups, { id, name, users }]);
  };
  
  
  

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/groups/");
        setGroups(res.data);
      } catch (err) {
        console.error("Failed to fetch groups", err);
      }
    };

    fetchGroups();
  }, []);

  return (
    <div className="p-4">
      <GroupForm onCreate={createGroup} />
      <ul>
        {groups.map((group) => (
          <li key={group.id} className="border p-2 my-4 rounded">
            <h2 className="font-bold text-lg mb-1">{group.name}</h2>
            <AddExpense group={group} onExpenseAdded={() => {}} />
            <GroupBalances groupId={group.id} />
            <ChatBot groupName={group.name} />
          </li>
        ))}
      </ul>
    </div>
  );
}
