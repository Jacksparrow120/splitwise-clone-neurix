import { useState } from "react";
import axios from "axios";

export default function ChatBot({ groupName }) {
  const [query, setQuery] = useState("");
  const [reply, setReply] = useState("");

  const sendMessage = async () => {
    if (!query.trim()) return;

    try {
      const res = await axios.post("http://127.0.0.1:8000/chat/", {
        query,
        group_name: groupName
      });
      setReply(res.data.reply);
    } catch (err) {
      console.error(err);
      setReply(" Failed to get response from AI.");
    }
  };

  return (
    <div className="border p-2 my-2 rounded">
      <h3 className="font-semibold mb-1">Group Bot</h3>
      <input
        type="text"
        className="border p-1 w-full mb-1"
        placeholder="Ask something about group expenses..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-3 py-1 rounded"
        onClick={sendMessage}
      >
        Ask
      </button>
      {reply && (
        <p className="mt-2 text-sm bg-gray-100 p-2 rounded">{reply}</p>
      )}
    </div>
  );
}
