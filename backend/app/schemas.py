from pydantic import BaseModel
from typing import List,  Optional

class UserCreate(BaseModel):
    name: str

class GroupCreate(BaseModel):
    name: str
    users: List[UserCreate]

class ExpenseSplit(BaseModel):
    user_id: int
    percentage: Optional[float] = None

class ExpenseCreate(BaseModel):
    description: str
    amount: float
    paid_by: int
    split_type: str 
    splits: Optional[List[ExpenseSplit]] = None