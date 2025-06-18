from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import models, schemas

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/groups/{group_id}/expenses")
def add_expense(group_id: int, expense: schemas.ExpenseCreate, db: Session = Depends(get_db)):
    new_expense = models.Expense(
        description=expense.description,
        amount=expense.amount,
        paid_by=expense.paid_by,
        group_id=group_id,
        split_type=expense.split_type
    )
    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)
    if expense.split_type == "equal":
        members = db.query(models.GroupMember).filter(models.GroupMember.group_id == group_id).all()
        per_person = expense.amount / len(members)

        for m in members:
            split = models.ExpenseSplit(
                expense_id=new_expense.id,
                user_id=m.user_id,
                amount=per_person
            )
            db.add(split)

    elif expense.split_type == "percentage":
        for s in expense.splits:
            owed = expense.amount * (s.percentage / 100)
            split = models.ExpenseSplit(
                expense_id=new_expense.id,
                user_id=s.user_id,
                amount=owed
            )
            db.add(split)

    db.commit()


    return {"expense_id": new_expense.id, "message": "Expense recorded"}
