import { useState } from "react";
import axios from "axios";

export default function GroupForm({ onCreate }) {
  const [groupName, setGroupName] = useState("");
  const [users, setUsers] = useState([{ name: "" }]);

  const handleUserChange = (index, value) => {
    const updated = [...users];
    updated[index].name = value;
    setUsers(updated);
  };

  const addUserField = () => setUsers([...users, { name: "" }]);

  const removeUserField = (index) => {
    const updated = users.filter((_, i) => i !== index);
    setUsers(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    try {
      const res = await axios.post("http://127.0.0.1:8000/groups/", {
        name: groupName,
        users,
      });
      onCreate({
        id: res.data.group_id,
        name: groupName,
        users,
      });
      setGroupName("");
      setUsers([{ name: "" }]);
    } catch (err) {
      alert("Failed to create group");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="my-4 space-y-2">
      <input
        type="text"
        placeholder="Enter group name"
        className="border p-2 rounded w-1/2"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />
      <div>
        {users.map((user, i) => (
          <div key={i} className="flex space-x-2 my-1">
            <input
              type="text"
              placeholder={`User ${i + 1}`}
              className="border p-2 rounded w-1/2"
              value={user.name}
              onChange={(e) => handleUserChange(i, e.target.value)}
            />
            {users.length > 1 && (
              <button
                type="button"
                onClick={() => removeUserField(i)}
                className="text-red-500"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addUserField}
          className="bg-gray-200 px-2 py-1 rounded"
        >
          + Add User
        </button>
      </div>
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
        Create Group
      </button>
    </form>
  );
}
