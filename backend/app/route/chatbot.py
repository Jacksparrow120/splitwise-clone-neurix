from fastapi import APIRouter
from pydantic import BaseModel
import openai
import requests
import os
from dotenv import load_dotenv

router = APIRouter()

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

client = openai.OpenAI(api_key=api_key)

class ChatRequest(BaseModel):
    query: str
    group_name: str = None


def get_group_id_from_name(group_name: str):
    """Fetch group_id from group name"""
    try:
        res = requests.get("http://127.0.0.1:8000/groups/")
        groups = res.json()
        for g in groups:
            if g["name"].lower() == group_name.lower():
                return g["id"]
    except Exception as e:
        print("Error fetching group list:", e)
    return None


def get_balances_text(group_id: int):
    """Format balances into readable text"""
    try:
        res = requests.get(f"http://127.0.0.1:8000/groups/{group_id}/balances")
        balances = res.json()
        return "\n".join([
            f"{b['from']} owes {b['to']}: ₹{b['amount']}" for b in balances
        ]) or "No balances yet."
    except Exception as e:
        print("Error fetching balances:", e)
        return "No balance information available."


@router.post("/chat/")
def chat_with_bot(payload: ChatRequest):
    try:
        group_name = payload.group_name or "N/A"
        group_id = get_group_id_from_name(group_name)
        balances_text = get_balances_text(group_id) if group_id else "No matching group found."

        prompt = f"""
        You are an AI assistant for a group expense tracker.

        Group Name: {group_name}

        Current balances:
        {balances_text}

        User asked:
        {payload.query}

        Respond in a helpful, short and friendly tone.
        """

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}]
        )

        return {"reply": response.choices[0].message.content.strip()}

    except Exception as e:
        print("OpenAI Error:", e)
        return {"error": str(e)}
